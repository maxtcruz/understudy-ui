import React from "react";
import PropTypes from "prop-types";
import "./SavePlaylistModal.css";

class SavePlaylistModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playlistName: "",
      error: ""
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.genre !== this.props.genre) {
      this.setState({playlistName: `understudy - ${this.props.genre}`});
    }
  }

  handleOnChange = (event) => {
    this.setState({playlistName: event.target.value});
  };

  onSavePlaylist = () => {
    const {playlistName} = this.state;
    if (playlistName) {
      this.props.onSavePlaylist(playlistName);
      this.setState({error: ""});
    } else {
      this.setState({error: "please enter a name for the playlist"});
    }
  };

  onCancel = () => {
    this.props.onDismissModal();
    this.setState({error: ""});
  };

  render() {
    const {showModal} = this.props;
    const {
      error,
      playlistName
    } = this.state;
    if (!showModal) {
      return null;
    }
    let errorJsx;
    if (error) {
      errorJsx = (
          <div className="save-playlist-error">
            {error}
          </div>
      );
    }
    return (
        <div className="save-playlist-modal-container">
          <div className="save-playlist-modal">
            <div className="playlist-name-input">
              {errorJsx}
              <input
                  type="text"
                  value={playlistName}
                  onChange={this.handleOnChange} />
            </div>
            <button
                onClick={this.onSavePlaylist}
                className="save-playlist-button">
              save playlist
            </button>
            <button
                onClick={this.onCancel}
                className="cancel-button">
              cancel
            </button>
          </div>
        </div>
    );
  }
}

SavePlaylistModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  onDismissModal: PropTypes.func.isRequired,
  onSavePlaylist: PropTypes.func.isRequired,
  genre: PropTypes.string.isRequired
};

export default SavePlaylistModal;