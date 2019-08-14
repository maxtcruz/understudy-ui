import React from "react";
import PropTypes from "prop-types";
import "./TimeInput.css";

class TimeInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hours: "",
      error: ""
    }

  }

  handleOnChange = (event) => {
    this.setState({hours: event.target.value});
  };

  handleOnClick = () => {
    const hours = Number(this.state.hours);
    if (hours) {
      this.props.onSetTime(hours * 3600000);
    } else {
      this.setState({hours: "", error: "please enter a valid number"});
    }
  };

  render() {
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
          <button onClick={this.handleOnClick}>
            set hours
          </button>
        </div>
    );

  }
}

TimeInput.propTypes = {
  onSetTime: PropTypes.func.isRequired
};

export default TimeInput;