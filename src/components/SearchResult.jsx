import React from 'react';
import PropTypes from 'prop-types';
import './SearchResult.css';
import {getTrackDisplayName} from "../util/SpotifyWebAPIHelpers";

class SearchResult extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {trackInfo} = this.props;
    return (
        <div
            className="search-result"
            onClick={() => {this.props.addTrackToQueue(trackInfo)}}>
          {getTrackDisplayName(trackInfo)}
        </div>);
  }
}

SearchResult.propTypes = {
  addTrackToQueue: PropTypes.func.isRequired,
  trackInfo: PropTypes.object.isRequired
};

export default SearchResult;