import React from 'react';
import PropTypes from 'prop-types';
import './TrackSearcher.css';
import SearchResults from "./SearchResults";
import {getSpotifySearchEndpoint} from "../resources/RestEndpoints";
import {handleErrors} from "../util/RestHelpers";

class TrackSearcher extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: "",
      searchResults: []
    }
  }

  handleOnChange = (event) => {
    this.setState({searchQuery: event.target.value});
  };

  searchTrack = () => {
    fetch(getSpotifySearchEndpoint(this.state.searchQuery, "track"), {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${this.props.accessToken}`
      }
    })
    .then(handleErrors)
    .then((response) => {
      response.json().then((data) => {
        const searchResults = [];
        data.tracks.items.forEach((item) => {
          searchResults.push({
            trackName: item.name,
            artist: item.artists[0].name,
            id: item.id,
            explicit: item.explicit
          });
        });
        this.setState({searchResults});
      });
    })
    .catch((err) => {
      console.error(err);
    })
  };

  render() {
    return (
        <div className="track-searcher">
          <input
              type="text"
              value={this.state.searchQuery}
              className="search-field"
              onChange={this.handleOnChange}/>
          <button onClick={this.searchTrack}>
            search
          </button>
          <SearchResults
              searchResults={this.state.searchResults}
              addTrackToQueue={this.props.addTrackToQueue} />
        </div>
    );
  }
}

TrackSearcher.propTypes = {
  accessToken: PropTypes.string.isRequired,
  addTrackToQueue: PropTypes.func.isRequired
};

export default TrackSearcher;