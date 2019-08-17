import React from "react";
import PropTypes from "prop-types";
import "./CurrentPlaylist.css";
import {getFormattedTrackName} from "../../../util/SpotifyWebAPIHelpers";
import {
  getSpotifyAddTracksToPlaylistEndpoint,
  getSpotifyCreatePlaylistEndpoint
} from "../../../resources/RestEndpoints";
import {handleErrors} from "../../../util/RestHelpers";

const CurrentPlaylist = (props) => {
  const {
    loggedInUserId,
    accessToken,
    trackQueue,
    currentTrackIndex
  } = props;

  let playlist = [];
  trackQueue.forEach((track) => {
    if (track.index <= currentTrackIndex && !track.softDeleted) {
      playlist.push(track);
    }
  });

  //TODO: handle rare case when there are > 100 tracks (see Spotify API)
  const createPlaylist = () => {
    fetch(getSpotifyCreatePlaylistEndpoint(loggedInUserId), {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({"name": "understudy!"})
    })
    .then(handleErrors)
    .then((response) => {
      response.json()
      .then((data) => {
        const urisToSave = playlist.map((track) => {return track.uri});
        fetch(getSpotifyAddTracksToPlaylistEndpoint(data.id), {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({"uris": urisToSave})
        })
        .then(handleErrors)
        .catch((err) => {
          console.error(err);
        })
      })
    })
    .catch((err) => {
      console.error(err);
    });
  };

  let createPlaylistButtonJsx;
  if (playlist.length > 0) {
    createPlaylistButtonJsx = (
        <button onClick={createPlaylist}>
          save playlist to Spotify account
        </button>
    );
  }
  let trackNumber = 0;

  return (
      <div className="current-playlist">
        <div className="current-playlist-header">
          {createPlaylistButtonJsx}
        </div>
        <ul>
          {trackQueue.map((track) => {
            if (track.index <= currentTrackIndex && !track.softDeleted) {
              trackNumber++;
              return (
                  <li key={track.id}>
                    {trackNumber}. {getFormattedTrackName(track)}
                  </li>
              );
            } else {
              return null;
            }
          })}
        </ul>
      </div>
  );
};

CurrentPlaylist.propTypes = {
  loggedInUserId: PropTypes.string.isRequired,
  accessToken: PropTypes.string.isRequired,
  trackQueue: PropTypes.array.isRequired,
  currentTrackIndex: PropTypes.number.isRequired
};

export default CurrentPlaylist;