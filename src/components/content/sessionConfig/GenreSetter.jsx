import React from 'react';
import PropTypes from 'prop-types';
import './GenreSetter.css';

class GenreSetter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: "",
      genre: ""
    };
    this.prevGenre = "";
  }

  handleOnChange = (event) => {
    this.setState({searchQuery: event.target.value});
  };

  onSetGenre = () => {
    this.props.onSetGenre(this.state.searchQuery);
    this.setState({genre: this.state.searchQuery});
  };

  onChangeGenre = () => {
    this.prevGenre = this.state.genre;
    this.setState({genre: ""});
  };

  render() {
    const {
      genre,
      searchQuery
    } = this.state;
    const genreSelectedDisplayJsx = (
        <span>
          genre selected: <b>{genre || this.prevGenre}</b>
        </span>
    );
    let genreSetterJsx;
    let errorJsx;
    if (this.props.isStarted) {
      genreSetterJsx = genreSelectedDisplayJsx;
    } else {
      if (genre) {
        genreSetterJsx = (
            <React.Fragment>
              {genreSelectedDisplayJsx}
              <button
                  className="change-genre-button"
                  onClick={this.onChangeGenre}>
                change genre
              </button>
            </React.Fragment>
        );
      } else {
        genreSetterJsx = (
            <React.Fragment>
              <input
                  type="text"
                  value={searchQuery}
                  className="genre-field"
                  onChange={this.handleOnChange} />
              <button onClick={this.onSetGenre}>
                set genre
              </button>
            </React.Fragment>
        );
      }
      if (this.props.fillQueueError) {
        errorJsx = (
            <div className="fill-queue-error">
              this genre returned an insufficient number of tracks to fill the selected session time
            </div>
        );
      }
    }
    return (
        <div className="genre-setter">
          {errorJsx}
          {genreSetterJsx}
        </div>
    );
  }
}

GenreSetter.propTypes = {
  isStarted: PropTypes.bool.isRequired,
  onSetGenre: PropTypes.func.isRequired,
  fillQueueError: PropTypes.bool.isRequired
};

export default GenreSetter;