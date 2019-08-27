import React from "react";
import PropTypes from "prop-types";
import "./CurrentPlaylist.css";
import {getFormattedTrackName} from "../../../../util/SpotifyWebAPIHelpers";
import {
  getSpotifyAddTracksToPlaylistEndpoint,
  getSpotifyCreatePlaylistEndpoint
} from "../../../../resources/RestEndpoints";
import {handleErrors} from "../../../../util/RestHelpers";
import SavePlaylistModal from "./SavePlaylistModal";

class CurrentPlaylist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
  }

  //TODO: handle rare case when there are > 100 tracks (see Spotify API)
  savePlaylist = (playlistName) => {
    const {
      loggedInUserId,
      accessToken,
    } = this.props;
    fetch(getSpotifyCreatePlaylistEndpoint(loggedInUserId), {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({"name": playlistName})
    })
    .then(handleErrors)
    .then((response) => {
      response.json()
      .then((data) => {
        const urisToSave = this.getPlaylist().map((track) => {return track.uri});
        fetch(getSpotifyAddTracksToPlaylistEndpoint(data.id), {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({"uris": urisToSave})
        })
        .then(handleErrors)
        .then(() => {
          this.toggleShowModal();
        })
        .catch((err) => {
          console.error(err);
        })
      })
    })
    .catch((err) => {
      console.error(err);
    });
  };

  toggleShowModal = () => {
    this.setState({showModal: !this.state.showModal});
  };

  getPlaylist = () => {
    const {
      trackQueue,
      currentTrackIndex
    } = this.props;
    return trackQueue.filter((track) => {
      return track.index <= currentTrackIndex && !track.softDeleted;
    });
  };

  render() {
    const playlist = this.getPlaylist();
    let savePlaylistButtonJsx;
    if (playlist.length > 0) {
      savePlaylistButtonJsx = (
          <button onClick={this.toggleShowModal}>
            save playlist to Spotify account
          </button>
      );
    }
    let currentPlaylistTitleJsx;
    if (playlist.length > 0) {
      currentPlaylistTitleJsx = (
          <h3 className="current-playlist-title">
            current playlist
          </h3>
      );
    }
    let trackNumber = 0;
    return (
        <div className="current-playlist">
          <div className="current-playlist-header">
            {savePlaylistButtonJsx}
            {currentPlaylistTitleJsx}
          </div>
          <ul>
            {playlist.map((track) => {
              trackNumber++;
              return (
                  <li key={track.id}>
                    {trackNumber}. {getFormattedTrackName(track)}
                  </li>
              );
            })}
          </ul>
          <SavePlaylistModal
              showModal={this.state.showModal}
              onDismissModal={this.toggleShowModal}
              onSavePlaylist={this.savePlaylist}
              genre={this.props.genre} />
        </div>
    );
  }

}

CurrentPlaylist.propTypes = {
  loggedInUserId: PropTypes.string.isRequired,
  accessToken: PropTypes.string.isRequired,
  trackQueue: PropTypes.array.isRequired,
  currentTrackIndex: PropTypes.number.isRequired,
  genre: PropTypes.string.isRequired
};

export default CurrentPlaylist;