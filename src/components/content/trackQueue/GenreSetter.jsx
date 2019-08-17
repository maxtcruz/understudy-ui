import React from 'react';
import PropTypes from 'prop-types';
import './GenreSetter.css';

class GenreSetter extends React.Component {
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
    this.props.onSetGenre(this.state.searchQuery);
  };

  render() {
    return (
        <div className="genre-setter">
          <input
              type="text"
              value={this.state.searchQuery}
              className="search-field"
              onChange={this.handleOnChange} />
          <button onClick={this.handleOnClick}>
            search genre
          </button>
        </div>
    );
  }
}

GenreSetter.propTypes = {
  onSetGenre: PropTypes.func.isRequired
};

export default GenreSetter;