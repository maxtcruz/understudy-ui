import React from 'react';
import PropTypes from 'prop-types';
import './Player.css';

class Player extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="player">
        <a href="http://localhost:8080/">
          <button>Authorize</button>
        </a>
      </div>
    );
  }
}

Player.propTypes = {
  hasAuthorizationCode: PropTypes.bool
};

export default Player;