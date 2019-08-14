import React from 'react';
import PropTypes from 'prop-types';
import './TrackQueue.css';
import {getTrackDisplayName} from "../../../util/SpotifyWebAPIHelpers";
import {getSpotifyPlayEndpoint} from "../../../resources/RestEndpoints";
import {handleErrors} from "../../../util/RestHelpers";
import {getClockFormat} from "../../../util/ClockHelpers";
import StartButton from "./StartButton";
import NowPlaying from "./NowPlaying";
import CurrentPlaylist from "./CurrentPlaylist";

class TrackQueue extends React.Component {
  constructor(props) {
    super(props);
    this.usedTrackIds = new Set();
    const {trackQueue, queueDurationMs} = this.fillQueue();
    this.state = {
      trackQueue,
      queueDurationMs,
      isStarted: false,
      currentTrackIndex: -1
    };
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isTrackOver
        && this.props.isTrackOver
        && this.state.currentTrackIndex < this.state.trackQueue.length - 1) {
      this.advanceToNextTrack()
      .then(() => {
        this.playCurrentTrack();
      });
    }
  }

  buildNewQueue = () => {
    this.usedTrackIds.clear();
    const {trackQueue, queueDurationMs} = this.fillQueue();
    this.setState({
      trackQueue,
      queueDurationMs
    });
  };

  fillQueue = (existingQueue = [], existingQueueDurationMs = 0) => {
    const {studyDurationMs, searchResults} = this.props;
    const trackQueue = existingQueue;
    let queueDurationMs = existingQueueDurationMs;
    while (queueDurationMs < studyDurationMs) {
      let trackToAdd = searchResults[Math.floor(Math.random() * searchResults.length)];
      while (this.usedTrackIds.has(trackToAdd.id)) {
        trackToAdd = searchResults[Math.floor(Math.random() * searchResults.length)];
      }
      this.usedTrackIds.add(trackToAdd.id);
      trackToAdd.index = trackQueue.length;
      queueDurationMs += trackToAdd.durationMs;
      trackQueue.push(trackToAdd);
    }
    return {
      trackQueue,
      queueDurationMs
    };
  };

  replaceTrack = (trackToBeSoftDeleted) => {
    return new Promise((resolve) => {
      const existingTrackQueue = [];
      let existingQueueDurationMs = 0;
      this.state.trackQueue.forEach((track) => {
        if (!track.softDeleted) {
          if (track.id === trackToBeSoftDeleted) {
            existingTrackQueue.push(Object.assign({}, track, {softDeleted: true}));
          } else {
            existingQueueDurationMs += track.durationMs;
            existingTrackQueue.push(track);
          }
        } else {
          existingTrackQueue.push(track);
        }
      });
      const {trackQueue, queueDurationMs} = this.fillQueue(existingTrackQueue, existingQueueDurationMs);
      this.setState({
        trackQueue,
        queueDurationMs
      }, () => {
        resolve();
      });
    });
  };

  startQueue = () => {
    this.advanceToNextTrack()
    .then(() => {
      this.playCurrentTrack();
    });
    this.props.onStart();
    this.setState({isStarted: true});
  };

  playCurrentTrack = () => {
    const {deviceId, accessToken} = this.props;
    const {trackQueue, currentTrackIndex} = this.state;
    fetch(getSpotifyPlayEndpoint(deviceId), {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify({"uris": [`spotify:track:${trackQueue[currentTrackIndex].id}`]})
    })
    .then(handleErrors)
    .catch((err) => {
      console.error(err);
    });
  };

  skip = () => {
    const {trackQueue, currentTrackIndex} = this.state;
    this.replaceTrack(trackQueue[currentTrackIndex].id)
    .then(() => {
      this.advanceToNextTrack()
      .then(() => {
        this.playCurrentTrack();
      });
    });
  };

  advanceToNextTrack = () => {
    return new Promise((resolve) => {
      const {trackQueue, currentTrackIndex} = this.state;
      let index = currentTrackIndex + 1;
      while (trackQueue[index].softDeleted) {
        index++;
      }
      this.setState({currentTrackIndex: index}, () => {
        resolve();
      });
    });
  };

  render() {
    const {
      trackQueue,
      isStarted,
      currentTrackIndex,
      queueDurationMs
    } = this.state;
    if (trackQueue.length === 0) {
      return "building queue...";
    }
    const startButtonJsx = !isStarted
        ? <StartButton
            buildNewQueue={this.buildNewQueue}
            startQueue={this.startQueue} />
        : "";
    const nowPlayingJsx = isStarted
        ? <NowPlaying
            skip={this.skip}
            currentTrackIndex={currentTrackIndex}
            trackQueue={trackQueue} />
        : "";
    return (
        <div className="track-queue">
          <div className="track-queue-header">
            {startButtonJsx}
            {nowPlayingJsx}
            <div className="queue-duration">
              queue duration: {getClockFormat(queueDurationMs)}
            </div>
            <h3 className="up-next">
              up next
            </h3>
          </div>
          <ul className="up-next-tracks">
            {trackQueue.map((track) => {
              if (track.index > currentTrackIndex && !track.softDeleted) {
                return (
                    <li key={track.id}>
                      {getTrackDisplayName(track)}
                      <button onClick={() => {this.replaceTrack(track.id)}}>remove</button>
                    </li>
                );
              } else {
                return null;
              }
            })}
          </ul>
          <CurrentPlaylist
              loggedInUserId={this.props.loggedInUserId}
              accessToken={this.props.accessToken}
              trackQueue={trackQueue}
              currentTrackIndex={currentTrackIndex} />
        </div>
    );
  }
}

TrackQueue.propTypes = {
  accessToken: PropTypes.string.isRequired,
  deviceId: PropTypes.string.isRequired,
  loggedInUserId: PropTypes.string.isRequired,
  searchResults: PropTypes.array.isRequired,
  studyDurationMs: PropTypes.number.isRequired,
  isTrackOver: PropTypes.bool.isRequired,
  onStart: PropTypes.func.isRequired
};

export default TrackQueue;