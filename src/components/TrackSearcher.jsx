import React from 'react';
import PropTypes from 'prop-types';
import './TrackSearcher.css';
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

  render() {
    return (
        <div>
          <div className="track-searcher">
            <input type="text" value={this.state.searchQuery} onChange={this.handleOnChange}/>
            <button onClick={this.handleSearch}>
              search
            </button>
          </div>
          <div className="results">
            <ul>
            {this.state.searchResults.map((item) => {
              return (<li key={item.id}>{item.artist} - {item.trackName}</li>);
            })}
            </ul>
          </div>
        </div>
    );
  }
}

TrackSearcher.propTypes = {
  accessToken: PropTypes.string
};

export default TrackSearcher;