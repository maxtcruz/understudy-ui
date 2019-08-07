import React from "react";
import PropTypes from "prop-types";
import "./Clock.css";

const Clock = (props) => {
  const getTimeRemaining = () => {
    return props.studyDurationMs - props.timeElapsedMs;
  };

  const getClockFormat = (ms) => {
    const totalSeconds = Math.ceil(ms / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const seconds = totalSeconds % 60;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${hours}:${formattedMinutes}:${formattedSeconds}`;
  };

  if (!props.isTimeSet) {
    return null;
  }

  return (
      <div className="clock">
        <div className="time-remaining">
          time remaining: {getClockFormat(getTimeRemaining())}
        </div>
        <div className="queue-duration">
          queue duration: {getClockFormat(props.queueDurationMs)}
        </div>
      </div>
  );
};

Clock.propTypes = {
  queueDurationMs: PropTypes.number.isRequired,
  studyDurationMs: PropTypes.number.isRequired,
  timeElapsedMs: PropTypes.number.isRequired,
  isTimeSet: PropTypes.bool.isRequired
};

export default Clock;