import React from 'react';
import PropTypes from 'prop-types';
import './TrackQueue.css';
import {getFormattedTrackName} from "../../../util/SpotifyWebAPIHelpers";
import {
  getSpotifyPlayEndpoint,
  getSpotifySearchEndpoint
} from "../../../resources/RestEndpoints";
import {handleErrors} from "../../../util/RestHelpers";
import {getClockFormat} from "../../../util/ClockHelpers";
import {NUM_TRACKS_TO_SEARCH} from "../../../constants/NumberConstants";
import NowPlaying from "../NowPlaying";
import CurrentPlaylist from "../currentPlaylist/CurrentPlaylist";
import GenreSetter from "./GenreSetter";

class TrackQueue extends React.Component {
  constructor(props) {
    super(props);
    this.usedTrackIds = new Set();
    this.state = {
      searchResults: [],
      genre: "",
      trackQueue: [],
      queueDurationMs: 0,
      currentTrackIndex: -1
    };
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isStarted && this.props.isStarted) {
      this.advanceToNextTrack()
      .then(() => {
        this.playCurrentTrack();
      });
    }
    if (!prevProps.isTrackOver
        && this.props.isTrackOver
        && this.state.currentTrackIndex < this.state.trackQueue.length - 1) {
      this.advanceToNextTrack()
      .then(() => {
        this.playCurrentTrack();
      });
    }
    if (prevProps.studyDurationMs < this.props.studyDurationMs
        && this.state.genre) {
      const {trackQueue, queueDurationMs} = this.fillQueue(this.state.trackQueue, this.state.queueDurationMs);
      this.setState({trackQueue, queueDurationMs});
    }
  }

  onSetGenre = (genre) => {
    if (genre !== this.state.genre) {
      this.searchTracks(genre, NUM_TRACKS_TO_SEARCH)
      .then(() => {
        this.buildNewQueue();
      });
    }
    this.setState({genre});
    this.props.onSetGenre();
  };

  searchTracks = (searchQuery, totalNumTracksToSearch) => {
    return new Promise((resolve) => {
      const searchResults = [];
      let offset = 0;
      while (offset < totalNumTracksToSearch) {
        fetch(getSpotifySearchEndpoint("genre:" + searchQuery, "track", offset,
            50), {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${this.props.accessToken}`
          }
        })
        .then(handleErrors)
        .then((response) => {
          response.json().then((data) => {
            data.tracks.items.forEach((item) => {
              searchResults.push({
                trackName: item.name,
                artists: item.artists,
                id: item.id,
                explicit: item.explicit,
                durationMs: item.duration_ms,
                uri: item.uri
              });
            });
            if (searchResults.length >= totalNumTracksToSearch) {
              this.setState({searchResults}, () => {
                resolve();
              });
            }
          });
        })
        .catch((err) => {
          console.error(err);
        });
        offset += 50;
      }
    });
  };

  buildNewQueue = () => {
    this.usedTrackIds.clear();
    const {trackQueue, queueDurationMs} = this.fillQueue();
    this.setState({
      trackQueue,
      queueDurationMs
    });
  };

  fillQueue = (existingQueue = [], existingQueueDurationMs = 0) => {
    const {studyDurationMs} = this.props;
    const {searchResults} = this.state;
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
      isStarted,
      loggedInUserId,
      accessToken
    } = this.props;
    const {
      trackQueue,
      currentTrackIndex,
      queueDurationMs,
      genre
    } = this.state;
    const genreSetterJsx = !genre
        ? <GenreSetter onSetGenre={this.onSetGenre} />
        : "";
    const genreSelectedJsx = genre
        ? <div>
          genre selected: {this.state.genre}
        </div>
        : "";
    const buildNewQueueButtonJsx = !isStarted && trackQueue.length > 0
        ? <button onClick={this.buildNewQueue}>
          build new queue
        </button>
        : "";
    const queueDurationJsx = trackQueue.length > 0
        ? <div className="queue-duration">
          queue duration: {getClockFormat(queueDurationMs)}
        </div>
        : "";
    const upNextJsx = trackQueue.length > 0
        ? <h3 className="up-next">
          up next
        </h3>
        : "";
    const nowPlayingJsx = isStarted
        ? <NowPlaying
            skip={this.skip}
            currentTrackIndex={currentTrackIndex}
            trackQueue={trackQueue} />
        : "";
    return (
        <React.Fragment>
          <div className="track-queue">
            <div className="track-queue-header">
              {genreSetterJsx}
              {genreSelectedJsx}
              {buildNewQueueButtonJsx}
              {queueDurationJsx}
              {upNextJsx}
            </div>
            <ul className="up-next-tracks">
              {trackQueue.map((track) => {
                if (track.index > currentTrackIndex && !track.softDeleted) {
                  return (
                      <li key={track.id}>
                        {getFormattedTrackName(track)}
                        <button onClick={() => {this.replaceTrack(track.id)}}>remove</button>
                      </li>
                  );
                } else {
                  return null;
                }
              })}
            </ul>
          </div>
          <CurrentPlaylist
              loggedInUserId={loggedInUserId}
              accessToken={accessToken}
              trackQueue={trackQueue}
              currentTrackIndex={currentTrackIndex} />
          {nowPlayingJsx}
        </React.Fragment>
    );
  }
}

TrackQueue.propTypes = {
  accessToken: PropTypes.string.isRequired,
  deviceId: PropTypes.string.isRequired,
  loggedInUserId: PropTypes.string.isRequired,
  studyDurationMs: PropTypes.number.isRequired,
  isStarted: PropTypes.bool.isRequired,
  isTrackOver: PropTypes.bool.isRequired,
  onSetGenre: PropTypes.func.isRequired
};

export default TrackQueue;