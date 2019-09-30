import React from "react";
import PropTypes from "prop-types";
import "./TimeSetter.css";
import {MS_PER_HOUR} from "../../../constants/NumberConstants";
import {getClockFormat} from "../../../util/ClockHelpers";

class TimeSetter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hours: "",
      error: "",
      studyDurationMs: 0
    };
    this.prevStudyDurationMs = 0;
  }

  handleOnChange = (event) => {
    this.setState({hours: event.target.value});
  };

  onSetTime = () => {
    const hours = Number(this.state.hours);
    if (hours && hours > 0) {
      if (hours > 24) {
        this.setState({hours: "", error: "understudy supports a maximum session time of 24 hours"});
      } else {
        const ms = hours * MS_PER_HOUR;
        this.props.onSetTime(ms);
        this.setState({studyDurationMs: ms, error: ""});
      }
    } else {
      this.setState({hours: "", error: "please enter a valid number of hours"});
    }
  };

  onChangeTime = () => {
    this.prevStudyDurationMs = this.state.studyDurationMs;
    this.setState({hours: this.state.studyDurationMs / MS_PER_HOUR, studyDurationMs: 0});
  };

  render() {
    const sessionTimeDisplayJsx = (
        <span>
            session time: <b>{getClockFormat(this.state.studyDurationMs || this.prevStudyDurationMs)}</b>
        </span>
    );
    let timeSetterJsx;
    let errorJsx;
    if (this.props.isStarted) {
      timeSetterJsx = sessionTimeDisplayJsx
    } else {
      if (this.state.studyDurationMs) {
        timeSetterJsx = (
            <React.Fragment>
              {sessionTimeDisplayJsx}
              <button
                  className="change-time-button"
                  onClick={this.onChangeTime}>
                change time
              </button>
            </React.Fragment>
        );
      } else {
        timeSetterJsx = (
            <React.Fragment>
              <input
                  type="text"
                  value={this.state.hours}
                  className="time-field"
                  onChange={this.handleOnChange} />
              <button onClick={this.onSetTime}>
                set hours
              </button>
            </React.Fragment>
        );
      }
      if (this.state.error) {
        errorJsx = (
            <div className="time-error">
              {this.state.error}
            </div>
        );
      }
    }
    return (
        <div className="time-setter">
          {errorJsx}
          {timeSetterJsx}
        </div>
    );
  }
}

TimeSetter.propTypes = {
  isStarted: PropTypes.bool.isRequired,
  onSetTime: PropTypes.func.isRequired
};

export default TimeSetter;