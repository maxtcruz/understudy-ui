import React from 'react';
import PropTypes from 'prop-types';
import './Player.css';
import {getSpotifyAuthCodeEndpoint} from "../constants/RestEndpoints";
import CookieHelpers from "../util/CookieHelpers";

class Player extends React.Component {
  constructor(props) {
    super(props);
  }

  handleAuthButtonClick = () => {
    CookieHelpers.removeCookie("spotifyAccessToken");
    window.location.assign(getSpotifyAuthCodeEndpoint());
  };

  render() {
    let authorizationErrorJsx;
    if (this.props.authorizationError) {
      authorizationErrorJsx = (
          <div className="auth-error">
            understudy needs access to your Spotify account info to function.
          </div>
      );
    }

    let authorizationButtonJsx;
    if (!this.props.authorizationCode) {
      authorizationButtonJsx = (
          <button onClick={this.handleAuthButtonClick}>
            connect your Spotify account to understudy
          </button>
      );
    }

    return (
        <div className="player">
          <button onClick={() => {alert(this.player)}}>test</button>
          {authorizationErrorJsx}
          {authorizationButtonJsx}
        </div>
    );
  }
}

Player.propTypes = {
  authorizationCode: PropTypes.string,
  authorizationError: PropTypes.string,
  accessToken: PropTypes.string
};

export default Player;