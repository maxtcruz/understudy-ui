import React from 'react';
import PropTypes from 'prop-types';
import './Content.css';
import SearchInput from "./SearchInput";
import TrackQueue from "./TrackQueue";
import {getSpotifySearchEndpoint} from "../resources/RestEndpoints";
import {handleErrors} from "../util/RestHelpers";

class Content extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trackQueue: [],
      queueDurationMs: 0,
      studyDurationMs: 3600000,
      isStarted: false
    };
    this.usedTrackIds = new Set();
    this.searchResults = [];
  }

  buildInitialQueue = (searchQuery) => {
    this.searchTracks(searchQuery, 1000)
    .then((searchResults) => {
      this.searchResults = searchResults;
      this.fillQueue();
    });
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
                artist: item.artists[0].name,
                id: item.id,
                explicit: item.explicit,
                durationMs: item.duration_ms
              });
            });
            if (searchResults.length >= totalNumTracksToSearch) {
              resolve(searchResults);
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

  fillQueue = (trackToBeSoftDeleted) => {
    const trackQueue = [];
    let queueDurationMs = 0;
    this.state.trackQueue.forEach((track) => {
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
    while (queueDurationMs < this.state.studyDurationMs) {
      let trackToAdd = this.searchResults[Math.floor(Math.random() * this.searchResults.length)];
      while (this.usedTrackIds.has(trackToAdd.id)) {
        trackToAdd = this.searchResults[Math.floor(Math.random() * this.searchResults.length)];
      }
      this.usedTrackIds.add(trackToAdd.id);
      trackToAdd.index = trackQueue.length;
      queueDurationMs += trackToAdd.durationMs;
      trackQueue.push(trackToAdd);
    }
    this.setState({trackQueue, queueDurationMs});
  };

  onStart = () => {
    this.setState({isStarted: true});
  };

  getClockFormat = (ms) => {
    const totalSeconds = Math.ceil(ms / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const seconds = totalSeconds % 60;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${hours}:${formattedMinutes}:${formattedSeconds}`;
  };

  render() {
    return (
        <div className="content">
          <SearchInput
              onSearch={this.buildInitialQueue}
              isStarted={this.state.isStarted} />
          {`queue duration: ${this.getClockFormat(this.state.queueDurationMs)}`}
          <TrackQueue
              accessToken={this.props.accessToken}
              deviceId={this.props.deviceId}
              trackQueue={this.state.trackQueue}
              isTrackOver={this.props.isTrackOver}
              onStart={this.onStart}
              fillQueue={this.fillQueue} />
        </div>
    );
  }
}

Content.propTypes = {
  accessToken: PropTypes.string.isRequired,
  deviceId: PropTypes.string.isRequired,
  isTrackOver: PropTypes.bool.isRequired
};

export default Content;