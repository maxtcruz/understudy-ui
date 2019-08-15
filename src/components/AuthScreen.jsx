import React from 'react';
import PropTypes from 'prop-types';
import './AuthScreen.css';
import {getSpotifyAuthCodeEndpoint} from "../resources/RestEndpoints";
import Player from "./Player";

const AuthScreen = (props) => {
  const {
    authorizationCode,
    authorizationError,
    accessToken,
    loggedInUserId
  } = props;

  const handleAuthButtonClick = () => {
    window.location.assign(getSpotifyAuthCodeEndpoint());
  };

  if (accessToken && loggedInUserId) {
    return (
        <Player
            accessToken={accessToken}
            loggedInUserId={loggedInUserId} />
    );
  }

  let authorizationErrorJsx;
  if (authorizationError) {
    authorizationErrorJsx = (
        <div className="auth-error">
          {authorizationError}
        </div>
    );
  }

  let authorizationButtonJsx;
  if (!authorizationCode) {
    authorizationButtonJsx = (
        <button onClick={handleAuthButtonClick}>
          connect your Spotify account to understudy
        </button>
    );
  }

  return (
      <div className="auth-button">
        {authorizationErrorJsx}
        {authorizationButtonJsx}
      </div>
  );
};

AuthScreen.propTypes = {
  authorizationCode: PropTypes.string,
  authorizationError: PropTypes.string,
  accessToken: PropTypes.string,
  loggedInUserId: PropTypes.string
};

export default AuthScreen;