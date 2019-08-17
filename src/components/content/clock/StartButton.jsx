import React from "react";
import PropTypes from "prop-types";
import "./StartButton.css";

const StartButton = (props) => {
  const {onStart} = props;

  return (
      <div className="start-button">
        <button onClick={onStart}>
          start
        </button>
      </div>
  );
};

StartButton.propTypes = {
  onStart: PropTypes.func.isRequired
};

export default StartButton;