import React from "react";
import PropTypes from "prop-types";
import "./SavePlaylistModal.css";

class SavePlaylistModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playlistName: ""
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

  render() {
    if (!this.props.showModal) {
      return null;
    }
    return (
        <div className="save-playlist-modal-container">
          <div className="save-playlist-modal">
            <div className="playlist-name-input">
              <input
                  type="text"
                  value={this.state.playlistName}
                  onChange={this.handleOnChange} />
            </div>
            <button
                onClick={() => {this.props.onSavePlaylist(this.state.playlistName)}}
                className="save-playlist-button">
              save playlist
            </button>
            <button
                onClick={this.props.onDismissModal}
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