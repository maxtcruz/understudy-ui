import React from 'react';
import PropTypes from 'prop-types';
import './Content.css';
import {getSpotifySearchEndpoint, getSpotifyPlayEndpoint} from "../resources/RestEndpoints";
import {handleErrors} from "../util/RestHelpers";

class Content extends React.Component {
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

  handleSearch = () => {
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
            id: item.id
          });
        });
        this.setState({searchResults});
      });
    })
    .catch((err) => {
      console.error(err);
    })
  };

  handlePlayTrack = (trackId) => {
    fetch(getSpotifyPlayEndpoint(this.props.deviceId), {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${this.props.accessToken}`
      },
      body: JSON.stringify({"uris": [`spotify:track:${trackId}`]})
    })
    .then(handleErrors)
    .catch((err) => {
      console.error(err);
    });
  };

  render() {
    return (
        <div>
          <div className="track-searcher">
            <input
                type="text"
                value={this.state.searchQuery}
                className="search-field"
                onChange={this.handleOnChange}/>
            <button onClick={this.handleSearch}>
              search
            </button>
          </div>
          <div className="results">
            <ul>
              {this.state.searchResults.map((item) => {
                return (
                    <li
                        className="track"
                        key={item.id}
                        onClick={() => {this.handlePlayTrack(item.id)}}>
                      {item.artist} - {item.trackName}
                    </li>);
              })}
            </ul>
          </div>
        </div>
    );
  }
}

Content.propTypes = {
  accessToken: PropTypes.string.isRequired,
  deviceId: PropTypes.string.isRequired
};

export default Content;