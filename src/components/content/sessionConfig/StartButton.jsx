import React from "react";
import PropTypes from "prop-types";
import "./StartButton.css";

const StartButton = (props) => {
  const {
    studyDurationMs,
    genre,
    isStarted,
    onStart
  } = props;

  if (!studyDurationMs || !genre || isStarted) {
    return null;
  }

  return (
      <div className="start-button">
        <button onClick={onStart}>
          start
        </button>
      </div>
  );
};

StartButton.propTypes = {
  studyDurationMs: PropTypes.number.isRequired,
  genre: PropTypes.string.isRequired,
  isStarted: PropTypes.bool.isRequired,
  onStart: PropTypes.func.isRequired
};

export default StartButton;