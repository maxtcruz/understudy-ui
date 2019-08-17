import React from "react";
import PropTypes from "prop-types";
import "./Clock.css";
import {getClockFormat} from "../../../util/ClockHelpers";

const Clock = (props) => {
  const {
    studyDurationMs,
    timeElapsedMs,
    onChangeTime,
    isStarted
  } = props;

  const getTimeRemaining = () => {
    return studyDurationMs - timeElapsedMs;
  };

  let changeTimeButtonJsx;
  if (!isStarted) {
    changeTimeButtonJsx = (
        <button onClick={() => {onChangeTime(0)}}>
          change time
        </button>
    );
  }

  return (
      <div className="clock">
        {changeTimeButtonJsx}
        time remaining: {getClockFormat(getTimeRemaining())}
      </div>
  );
};

Clock.propTypes = {
  studyDurationMs: PropTypes.number.isRequired,
  timeElapsedMs: PropTypes.number.isRequired,
  onChangeTime: PropTypes.func.isRequired,
  isStarted: PropTypes.bool.isRequired
};

export default Clock;