import React from "react";
import PropTypes from "prop-types";
import "./Clock.css";
import {getClockFormat} from "../../../util/ClockHelpers";

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeElapsedMs: 0
    };
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isStarted && this.props.isStarted) {
      const clockTimer = setInterval(() => {
        if (this.state.timeElapsedMs < this.props.studyDurationMs) {
          this.setState({timeElapsedMs: this.state.timeElapsedMs + 1000});
        } else {
          clearInterval(clockTimer);
          //TODO: set end state
        }
      }, 1000);
    }
  }

  getTimeRemaining = () => {
    return this.props.studyDurationMs - this.state.timeElapsedMs;
  };

  render() {
    if (!this.props.isStarted) {
      return null;
    }
    return (
        <div className="clock">
          {getClockFormat(this.getTimeRemaining())}
        </div>
    );
  }
}

Clock.propTypes = {
  studyDurationMs: PropTypes.number.isRequired,
  isStarted: PropTypes.bool.isRequired
};

export default Clock;