import React from "react";
import PropTypes from "prop-types";
import "./NowPlaying.css";
import {getTrackDisplayName} from "../../../util/SpotifyWebAPIHelpers";

const NowPlaying = (props) => {
  const {
    skip,
    currentTrackIndex,
    trackQueue
  } = props;

  return (
      <div className="now-playing">
        <button
            onClick={skip}
            className="skip-button">
          skip
        </button>
        now playing: {currentTrackIndex > -1
          ? getTrackDisplayName(trackQueue[currentTrackIndex])
          : ""}
      </div>
  );
};

NowPlaying.propTypes = {
  skip: PropTypes.func.isRequired,
  currentTrackIndex: PropTypes.number.isRequired,
  trackQueue: PropTypes.array.isRequired
};

export default NowPlaying;