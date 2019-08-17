import React from "react";
import PropTypes from "prop-types";
import "./StartButton.css";

const StartButton = (props) => {
  const {
    buildNewQueue,
    startQueue
  } = props;

  return (
      <div className="start-button">
        <button onClick={buildNewQueue}>
          build new queue
        </button>
        <button onClick={startQueue}>
          start
        </button>
      </div>
  );
};

StartButton.propTypes = {
  buildNewQueue: PropTypes.func.isRequired,
  startQueue: PropTypes.func.isRequired
};

export default StartButton;