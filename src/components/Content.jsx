import React from 'react';
import PropTypes from 'prop-types';
import './Content.css';
import TimeInput from "./TimeInput";
import SearchInput from "./SearchInput";
import Clock from "./Clock";
import TrackQueue from "./TrackQueue";
import {getSpotifySearchEndpoint} from "../resources/RestEndpoints";
import {handleErrors} from "../util/RestHelpers";
import {NUM_TRACKS_TO_SEARCH} from "../constants/NumberConstants";

class Content extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trackQueue: [],
      queueDurationMs: 0,
      studyDurationMs: 0,
      timeElapsedMs: 0,
      isStarted: false,
      isTimeSet: false
    };
    this.usedTrackIds = new Set();
    this.searchResults = [];
  }

  buildNewQueue = (searchQuery) => {
    if (this.searchResults.length === 0) {
      this.searchTracks(searchQuery, NUM_TRACKS_TO_SEARCH)
      .then((searchResults) => {
        this.searchResults = searchResults;
        this.fillQueue([]);
      });
    } else {
      this.usedTrackIds.clear();
      this.fillQueue([]);
    }
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

  fillQueue = (existingQueue, trackToBeSoftDeleted) => {
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
    setInterval(() => {
      this.setState({timeElapsedMs: this.state.timeElapsedMs + 1000});
    }, 1000);
    this.setState({isStarted: true});
  };

  setStudyDurationMs = (ms) => {
    this.setState({studyDurationMs: ms, isTimeSet: true});
  };

  render() {
    return (
        <div className="content">
          <TimeInput
              onTimeSet={this.setStudyDurationMs}
              isTimeSet={this.state.isTimeSet} />
          <SearchInput
              onSearch={this.buildNewQueue}
              isStarted={this.state.isStarted}
              isTimeSet={this.state.isTimeSet} />
          <Clock
              queueDurationMs={this.state.queueDurationMs}
              studyDurationMs={this.state.studyDurationMs}
              timeElapsedMs={this.state.timeElapsedMs}
              isTimeSet={this.state.isTimeSet} />
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