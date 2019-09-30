import React from "react";
import PropTypes from "prop-types";
import "./SessionConfig.css";
import TimeSetter from "./TimeSetter";
import StartButton from "./StartButton";
import GenreSetter from "./GenreSetter";
import Clock from "./Clock";

const SessionConfig = (props) => {
  const {
    studyDurationMs,
    genre,
    isStarted,
    fillQueueError,
    onSetTime,
    onSetGenre,
    onStart
  } = props;

  return (
      <div className="session-config">
        <TimeSetter
            onSetTime={onSetTime}
            isStarted={isStarted} />
        <GenreSetter
            onSetGenre={onSetGenre}
            isStarted={isStarted}
            fillQueueError={fillQueueError} />
        <StartButton
            studyDurationMs={studyDurationMs}
            genre={genre}
            isStarted={isStarted}
            fillQueueError={fillQueueError}
            onStart={onStart} />
        <Clock
            studyDurationMs={studyDurationMs}
            isStarted={isStarted} />
      </div>
  );
};

SessionConfig.propTypes = {
  studyDurationMs: PropTypes.number.isRequired,
  genre: PropTypes.string.isRequired,
  isStarted: PropTypes.bool.isRequired,
  fillQueueError: PropTypes.bool.isRequired,
  onSetTime: PropTypes.func.isRequired,
  onSetGenre: PropTypes.func.isRequired,
  onStart: PropTypes.func.isRequired
};

export default SessionConfig;