import React from 'react';
import PropTypes from 'prop-types';
import './SearchResults.css';
import SearchResult from "./SearchResult";

class SearchResults extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <div className="search-results">
          <ul>
            {this.props.searchResults.map((trackInfo) => {
              return (
                  <li key={trackInfo.id}>
                    <SearchResult
                        addTrackToQueue={this.props.addTrackToQueue}
                        trackInfo={trackInfo} />
                  </li>);
            })}
          </ul>
        </div>
    );
  }
}

SearchResults.propTypes = {
  searchResults: PropTypes.array.isRequired,
  addTrackToQueue: PropTypes.func.isRequired
};

export default SearchResults;