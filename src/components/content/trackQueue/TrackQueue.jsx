import React from 'react';
import PropTypes from 'prop-types';
import './TrackQueue.css';
import {getFormattedTrackName} from "../../../util/SpotifyWebAPIHelpers";
import {
  getSpotifyPlayEndpoint,
  getSpotifySearchEndpoint
} from "../../../resources/RestEndpoints";
import {handleErrors} from "../../../util/RestHelpers";
import {
  NUM_TRACKS_PER_SEARCH,
  NUM_TRACKS_TO_SEARCH
} from "../../../constants/NumberConstants";
import NowPlaying from "./NowPlaying";
import CurrentPlaylist from "./currentPlaylist/CurrentPlaylist";

class TrackQueue extends React.Component {
  constructor(props) {
    super(props);
    this.usedTrackIds = new Set();
    this.state = {
      searchResults: [],
      searchResultsDurationMs: 0,
      trackQueue: [],
      currentTrackIndex: -1
    };
  }

  componentDidUpdate(prevProps) {
    // start queue on isStarted = true
    if (!prevProps.isStarted && this.props.isStarted) {
      this.advanceToNextTrack()
      .then(() => {
        this.playCurrentTrack();
      });
    }
    // play next track when current track ends
    if (!prevProps.isTrackOver
        && this.props.isTrackOver) {
      this.advanceToNextTrack()
      .then(() => {
        if (this.state.currentTrackIndex < this.state.trackQueue.length) {
          this.playCurrentTrack();
        }
      });
    }
    // add to queue when time increases
    if (prevProps.studyDurationMs < this.props.studyDurationMs
        && this.props.genre) {
      this.fillQueue();
    }
    // recompute queue when genre changes
    if (prevProps.genre !== this.props.genre) {
      this.searchTracks(this.props.genre, NUM_TRACKS_TO_SEARCH)
      .then(() => {
        this.buildNewQueue();
      });
    }
  }

  searchTracks = (searchQuery, totalNumTracksToSearch) => {
    return new Promise((resolve) => {
      const searchResults = [];
      let offset = 0;
      while (offset < totalNumTracksToSearch) {
        fetch(getSpotifySearchEndpoint("genre:" + searchQuery, "track", offset, NUM_TRACKS_PER_SEARCH), {
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
            // resolve when we've retrieved all the tracks desired/available
            if (searchResults.length >= totalNumTracksToSearch || data.tracks.items.length < 50) {
              let searchResultsDurationMs = 0;
              searchResults.forEach((track) => {
                searchResultsDurationMs += track.durationMs;
              });
              this.setState({
                searchResults,
                searchResultsDurationMs
              }, () => {
                resolve();
              });
            }
          });
        })
        .catch((err) => {
          console.error(err);
        });
        offset += NUM_TRACKS_PER_SEARCH;
      }
    });
  };

  buildNewQueue = () => {
    this.usedTrackIds.clear();
    this.setState({trackQueue: []}, () => {
      this.fillQueue();
    });
  };

  fillQueue = () => {
    return new Promise((resolve) => {
      const {studyDurationMs} = this.props;
      const {searchResults, searchResultsDurationMs} = this.state;
      if (searchResultsDurationMs < studyDurationMs) {
        this.props.onSetFillQueueError(true);
        resolve();
      }
      const trackQueue = [...this.state.trackQueue];
      let queueDurationMs = 0;
      trackQueue.forEach((track) => {
        if (!track.softDeleted) {
          queueDurationMs += track.durationMs;
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
      this.setState({trackQueue}, () => {
        this.props.onSetFillQueueError(false);
        resolve();
      });
    });
  };

  replaceTrack = (trackToBeSoftDeleted) => {
    return new Promise((resolve) => {
      const trackQueue = this.state.trackQueue.map((track) => {
        if (!track.softDeleted && track.id === trackToBeSoftDeleted) {
          return Object.assign({}, track, {softDeleted: true});
        } else {
          return track;
        }
      });
      this.setState({trackQueue}, () => {
        this.fillQueue()
        .then(() => {
          resolve();
        })
      })
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
      while (trackQueue[index] && trackQueue[index].softDeleted) {
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
      accessToken,
      genre
    } = this.props;
    const {
      trackQueue,
      currentTrackIndex
    } = this.state;
    const buildNewQueueButtonJsx = !isStarted && trackQueue.length > 0
        ? <button onClick={this.buildNewQueue}>
          build new queue
        </button>
        : "";
    const upNextTitleJsx = trackQueue.length > 0
        ? <h3 className="up-next-title">
          up next
        </h3>
        : "";
    const nowPlayingJsx = isStarted && currentTrackIndex < trackQueue.length
        ? <NowPlaying
            skip={this.skip}
            currentTrackIndex={currentTrackIndex}
            trackQueue={trackQueue} />
        : "";
    return (
        <React.Fragment>
          <div className="track-queue">
            <div className="track-queue-header">
              {buildNewQueueButtonJsx}
              {upNextTitleJsx}
            </div>
            <ul>
              {trackQueue.map((track) => {
                if (track.index > currentTrackIndex && !track.softDeleted) {
                  return (
                      <li
                          key={track.id}
                          className="track">
                        <button
                            onClick={() => {this.replaceTrack(track.id)}}
                            className="remove-track-button">
                          remove
                        </button>
                        <span className="track-name">
                          {getFormattedTrackName(track)}
                        </span>
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
              currentTrackIndex={currentTrackIndex}
              genre={genre} />
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
  genre: PropTypes.string.isRequired,
  isStarted: PropTypes.bool.isRequired,
  isTrackOver: PropTypes.bool.isRequired,
  onSetFillQueueError: PropTypes.func.isRequired
};

export default TrackQueue;