import React from "react";
import PropTypes from "prop-types";
import "./Clock.css";
import {getClockFormat} from "../util/ClockHelpers";

const Clock = (props) => {
  const getTimeRemaining = () => {
    return props.studyDurationMs - props.timeElapsedMs;
  };

  if (!props.studyDurationMs) {
    return null;
  }

  return (
      <div className="clock">
        time remaining: {getClockFormat(getTimeRemaining())}
      </div>
  );
};

Clock.propTypes = {
  queueDurationMs: PropTypes.number.isRequired,
  studyDurationMs: PropTypes.number.isRequired,
  timeElapsedMs: PropTypes.number.isRequired
};

export default Clock;