import React from 'react';
import PropTypes from 'prop-types';
import './GenreSetter.css';

class GenreSetter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: "",
      genre: ""
    }
  }

  handleOnChange = (event) => {
    this.setState({searchQuery: event.target.value});
  };

  onSetGenre = () => {
    this.props.onSetGenre(this.state.searchQuery);
    this.setState({genre: this.state.searchQuery});
  };

  onChangeGenre = () => {
    this.setState({genre: ""});
  };

  render() {
    const {
      genre,
      searchQuery
    } = this.state;
    if (genre) {
      let changeGenreButtonJsx;
      if (!this.props.isStarted) {
        changeGenreButtonJsx = (
            <button
                className="change-genre-button"
                onClick={this.onChangeGenre}>
              change genre
            </button>
        );
      }
      return (
          <div className="genre-setter">
            genre selected: <b>{genre}</b>
            {changeGenreButtonJsx}
          </div>
      );
    }
    return (
        <div className="genre-setter">
          <input
              type="text"
              value={searchQuery}
              className="genre-field"
              onChange={this.handleOnChange} />
          <button onClick={this.onSetGenre}>
            set genre
          </button>
        </div>
    );
  }
}

GenreSetter.propTypes = {
  isStarted: PropTypes.bool.isRequired,
  onSetGenre: PropTypes.func.isRequired
};

export default GenreSetter;