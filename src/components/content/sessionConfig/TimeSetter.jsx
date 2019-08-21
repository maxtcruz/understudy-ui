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
    }
  }

  handleOnChange = (event) => {
    this.setState({hours: event.target.value});
  };

  onSetTime = () => {
    const hours = Number(this.state.hours);
    if (hours) {
      const ms = hours * MS_PER_HOUR;
      this.props.onSetTime(ms);
      this.setState({studyDurationMs: ms, error: ""});
    } else {
      this.setState({hours: "", error: "please enter a valid number"});
    }
  };

  onChangeTime = () => {
    this.setState({hours: this.state.studyDurationMs / MS_PER_HOUR, studyDurationMs: 0});
  };

  render() {
    if (this.state.studyDurationMs) {
      let changeTimeButtonJsx;
      if (!this.props.isStarted) {
        changeTimeButtonJsx = (
            <button
                className="change-time-button"
                onClick={this.onChangeTime}>
              change time
            </button>
        );
      }
      return (
          <div className="time-setter">
            session time: <b>{getClockFormat(this.state.studyDurationMs)}</b>
            {changeTimeButtonJsx}
          </div>
      );
    }
    let errorJsx;
    if (this.state.error) {
      errorJsx = (
          <div className="time-error">
            {this.state.error}
          </div>
      );
    }
    return (
        <div className="time-setter">
          {errorJsx}
          <input
              type="text"
              value={this.state.hours}
              className="time-field"
              onChange={this.handleOnChange} />
          <button onClick={this.onSetTime}>
            set hours
          </button>
        </div>
    );

  }
}

TimeSetter.propTypes = {
  isStarted: PropTypes.bool.isRequired,
  onSetTime: PropTypes.func.isRequired
};

export default TimeSetter;