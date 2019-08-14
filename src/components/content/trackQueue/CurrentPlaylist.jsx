import React from "react";
import PropTypes from "prop-types";
import "./CurrentPlaylist.css";
import {getTrackDisplayName} from "../../../util/SpotifyWebAPIHelpers";

const CurrentPlaylist = (props) => {
  let trackNumber = 0;
  return (
      <ul>
        {props.trackQueue.map((track) => {
          if (track.index <= props.currentTrackIndex && !track.softDeleted) {
            trackNumber++;
            return (
                <li key={track.id}>
                  {trackNumber} {getTrackDisplayName(track)}
                </li>
            )
          } else {
            return null;
          }
      })}
      </ul>
  );
};

CurrentPlaylist.propTypes = {
  trackQueue: PropTypes.array.isRequired,
  currentTrackIndex: PropTypes.number.isRequired
};

export default CurrentPlaylist;