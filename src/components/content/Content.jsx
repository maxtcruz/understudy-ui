import React from 'react';
import PropTypes from 'prop-types';
import './Content.css';
import TimeInput from "./TimeInput";
import SearchInput from "./SearchInput";
import Clock from "./Clock";
import TrackQueue from "./trackQueue/TrackQueue";
import {getSpotifySearchEndpoint} from "../../resources/RestEndpoints";
import {handleErrors} from "../../util/RestHelpers";
import {NUM_TRACKS_TO_SEARCH} from "../../constants/NumberConstants";

class Content extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      studyDurationMs: 0,
      timeElapsedMs: 0,
      genre: "",
      searchResults: [],
      isStarted: false
    };
  }

  onSetGenre = (genre) => {
    this.searchTracks(genre, NUM_TRACKS_TO_SEARCH);
  };

  searchTracks = (searchQuery, totalNumTracksToSearch) => {
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
            this.setState({searchResults});
          }
        });
      })
      .catch((err) => {
        console.error(err);
      });
      offset += 50;
    }
  };

  onStart = () => {
    this.setState({isStarted: true});
    const clockTimer = setInterval(() => {
      if (this.state.timeElapsedMs < this.state.studyDurationMs) {
        this.setState({timeElapsedMs: this.state.timeElapsedMs + 1000});
      } else {
        clearInterval(clockTimer);
      }
    }, 1000);
  };

  setStudyDurationMs = (ms) => {
    this.setState({studyDurationMs: ms});
  };

  render() {
    const timeInputJsx = !this.state.studyDurationMs
        ? <TimeInput onSetTime={this.setStudyDurationMs} />
        : "";
    const searchInputJsx = this.state.studyDurationMs && this.state.searchResults.length === 0
        ? <SearchInput onSetGenre={this.onSetGenre} />
        : "";
    const trackQueueJsx = this.state.searchResults.length > 0
        ? <TrackQueue
            accessToken={this.props.accessToken}
            deviceId={this.props.deviceId}
            loggedInUserId={this.props.loggedInUserId}
            searchResults={this.state.searchResults}
            studyDurationMs={this.state.studyDurationMs}
            isTrackOver={this.props.isTrackOver}
            onStart={this.onStart} />
        : "";
    const clockJsx = this.state.studyDurationMs
        ? <Clock
            studyDurationMs={this.state.studyDurationMs}
            timeElapsedMs={this.state.timeElapsedMs}
            onChangeTime={this.setStudyDurationMs}
            isStarted={this.state.isStarted}/>
        : "";
    return (
        <div className="content">
          {timeInputJsx}
          {searchInputJsx}
          {trackQueueJsx}
          {clockJsx}
        </div>
    );
  }
}

Content.propTypes = {
  accessToken: PropTypes.string.isRequired,
  deviceId: PropTypes.string.isRequired,
  isTrackOver: PropTypes.bool.isRequired,
  loggedInUserId: PropTypes.string.isRequired
};

export default Content;