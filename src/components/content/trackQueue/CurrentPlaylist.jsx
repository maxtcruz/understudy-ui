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
        const tracksToSave = [];
        trackQueue.forEach((track) => {
          if (track.index <= currentTrackIndex && !track.softDeleted) {
            tracksToSave.push(track.uri);
          }
        });
        if (tracksToSave.length > 0) {
          fetch(getSpotifyAddTracksToPlaylistEndpoint(data.id), {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${accessToken}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({"uris": tracksToSave})
          })
          .then(handleErrors)
          .catch((err) => {
            console.error(err);
          })
        }
      })
    })
    .catch((err) => {
      console.error(err);
    });
  };

  let trackNumber = 0;

  return (
      <div className="current-playlist">
        <button onClick={createPlaylist}>
          save playlist to Spotify account
        </button>
        <ul>
          {trackQueue.map((track) => {
            if (track.index <= currentTrackIndex && !track.softDeleted) {
              trackNumber++;
              return (
                  <li key={track.id}>
                    {trackNumber} {getFormattedTrackName(track)}
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