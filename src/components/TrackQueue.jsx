import React from 'react';
import PropTypes from 'prop-types';
import './TrackQueue.css';
import {getTrackDisplayName} from "../util/SpotifyWebAPIHelpers";
import {getSpotifyPlayEndpoint} from "../resources/RestEndpoints";
import {handleErrors} from "../util/RestHelpers";
import {getClockFormat} from "../util/ClockHelpers";
//TODO: cleanup queue construction functions
class TrackQueue extends React.Component {
  constructor(props) {
    super(props);
    this.usedTrackIds = new Set();
    const queueInfo = this.constructQueue();
    this.state = {
      trackQueue: queueInfo.trackQueue,
      queueDurationMs: queueInfo.queueDurationMs,
      isStarted: false,
      currentTrackIndex: -1
    };
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isTrackOver
        && this.props.isTrackOver
        && this.state.currentTrackIndex < this.state.trackQueue.length - 1) {
      const nextTrack = this.findNextTrack(this.state.trackQueue);
      this.playTrack(nextTrack.id);
    }
  }

  findNextTrack = (trackQueue) => {
    let index = this.state.currentTrackIndex + 1;
    while (trackQueue[index].softDeleted) {
      index++;
    }
    this.setState({currentTrackIndex: index});
    return trackQueue[index];
  };

  startQueue = () => {
    const firstTrack = this.findNextTrack(this.state.trackQueue);
    this.playTrack(firstTrack.id);
    this.props.onStart();
    this.setState({isStarted: true});
  };

  playTrack = (trackId) => {
    const {deviceId, accessToken} = this.props;
    fetch(getSpotifyPlayEndpoint(deviceId), {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify({"uris": [`spotify:track:${trackId}`]})
    })
    .then(handleErrors)
    .catch((err) => {
      console.error(err);
    });
  };

  skip = () => {
    const {trackQueue} = this.state;
    const filledQueue = this.fillQueue(trackQueue, trackQueue[this.state.currentTrackIndex].id);
    const nextTrack = this.findNextTrack(filledQueue);
    this.playTrack(nextTrack.id);
  };

  buildNewQueue = () => {
    this.usedTrackIds.clear();
    return this.fillQueue([]);
  };

  fillQueue = (existingQueue, trackToBeSoftDeleted) => {
    const {studyDurationMs, searchResults} = this.props;
    const trackQueue = [];
    let queueDurationMs = 0;
    existingQueue.forEach((track) => {
      if (!track.softDeleted) {
        if (track.id === trackToBeSoftDeleted) {
          trackQueue.push(Object.assign({}, track, {softDeleted: true}));
        } else {
          queueDurationMs += track.durationMs;
          trackQueue.push(track);
        }
      } else {
        trackQueue.push(track);
      }
    });
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
    this.setState({trackQueue, queueDurationMs});
    return trackQueue;
  };

  constructQueue = (existingQueue) => {
    const {studyDurationMs, searchResults} = this.props;
    const trackQueue = existingQueue || [];
    let queueDurationMs = 0;
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

  render() {
    const {trackQueue} = this.state;
    if (trackQueue.length === 0) {
      return "building queue...";
    }
    let startButtonJsx;
    if (!this.state.isStarted) {
      startButtonJsx = (
          <div className="start-button">
            <button onClick={this.buildNewQueue}>
              build new queue
            </button>
            <button onClick={this.startQueue}>
              start
            </button>
          </div>
      );
    }
    let nowPlayingJsx;
    if (this.state.isStarted) {
      nowPlayingJsx = (
          <div className="now-playing">
            <button
                onClick={this.skip}
                className="skip-button">
              skip
            </button>
            now playing: {this.state.currentTrackIndex > -1
              ? getTrackDisplayName(trackQueue[this.state.currentTrackIndex])
              : ""}
          </div>
      );
    }
    return (
        <div className="track-queue">
          <div className="track-queue-header">
            <div className="queue-duration">
              queue duration: {getClockFormat(this.state.queueDurationMs)}
            </div>
            {startButtonJsx}
            {nowPlayingJsx}
            <h3 className="up-next">
              up next
            </h3>
          </div>
          <div>
            <ul>
              {trackQueue.map((track) => {
                if (track.index > this.state.currentTrackIndex && !track.softDeleted) {
                  return (
                      <li key={track.id}>
                        {getTrackDisplayName(track)}
                        <button onClick={() => {this.fillQueue(trackQueue, track.id)}}>remove</button>
                      </li>
                  );
                } else {
                  return null;
                }
              })}
            </ul>
          </div>
        </div>
    );
  }
}

TrackQueue.propTypes = {
  accessToken: PropTypes.string.isRequired,
  deviceId: PropTypes.string.isRequired,
  searchResults: PropTypes.array.isRequired,
  studyDurationMs: PropTypes.number.isRequired,
  isTrackOver: PropTypes.bool.isRequired,
  onStart: PropTypes.func.isRequired
};

export default TrackQueue;