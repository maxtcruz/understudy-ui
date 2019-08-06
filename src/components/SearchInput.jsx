import React from 'react';
import PropTypes from 'prop-types';
import './SearchInput.css';

class SearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: ""
    }
  }

  handleOnChange = (event) => {
    this.setState({searchQuery: event.target.value});
  };

  handleOnClick = () => {
    this.props.onSearch(this.state.searchQuery);
  };

  render() {
    let trackSearcherJsx;
    if (!this.props.isStarted) {
      trackSearcherJsx = (
          <React.Fragment>
            <input
                type="text"
                value={this.state.searchQuery}
                className="search-field"
                onChange={this.handleOnChange}/>
            <button onClick={this.handleOnClick}>
              search genre
            </button>
          </React.Fragment>
      );
    }
    return (
        <div className="track-searcher">
          {trackSearcherJsx}
        </div>
    );
  }
}

SearchInput.propTypes = {
  onSearch: PropTypes.func.isRequired,
  isStarted: PropTypes.bool.isRequired
};

export default SearchInput;