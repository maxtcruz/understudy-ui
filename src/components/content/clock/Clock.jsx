import React from "react";
import PropTypes from "prop-types";
import "./Clock.css";
import {getClockFormat} from "../../../util/ClockHelpers";
import TimeSetter from "./TimeSetter";
import StartButton from "./StartButton";

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      studyDurationMs: 0,
      isStarted: false
    };
  }

  getTimeRemaining = () => {
    return this.state.studyDurationMs - this.props.timeElapsedMs;
  };

  onSetTime = (ms) => {
    this.props.onSetTime(ms);
    this.setState({studyDurationMs: ms});
  };

  onChangeTime = () => {
    this.setState({studyDurationMs: 0});
  };

  onStart = () => {
    this.props.onStart();
    this.setState({isStarted: true});
  };

  render() {
    const {
      studyDurationMs,
      isStarted
    } = this.state;
    const timeSetterJsx = !studyDurationMs
        ? <TimeSetter onSetTime={this.onSetTime} />
        : "";
    const timeRemainingJsx = studyDurationMs
        ? `time remaining: ${getClockFormat(this.getTimeRemaining())}`
        : "";
    const changeTimeButtonJsx = studyDurationMs && !isStarted
        ? <button
            className="change-time-button"
            onClick={this.onChangeTime}>
          change time
        </button>
        : "";
    const startButtonJsx = studyDurationMs && this.props.isGenreSet && !isStarted
        ? <StartButton onStart={this.onStart} />
        : "";
    return (
        <div className="clock">
          {timeSetterJsx}
          {timeRemainingJsx}
          {changeTimeButtonJsx}
          {startButtonJsx}
        </div>
    );
  }
}

Clock.propTypes = {
  studyDurationMs: PropTypes.number.isRequired,
  timeElapsedMs: PropTypes.number.isRequired,
  isGenreSet: PropTypes.bool.isRequired,
  onSetTime: PropTypes.func.isRequired,
  onStart: PropTypes.func.isRequired
};

export default Clock;