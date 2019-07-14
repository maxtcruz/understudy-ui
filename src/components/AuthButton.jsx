import React from 'react';
import PropTypes from 'prop-types';
import './AuthButton.css';
import {getSpotifyAuthCodeEndpoint} from "../resources/RestEndpoints";
import CookieHelpers from "../util/CookieHelpers";
import {SPOTIFY_ACCESS_TOKEN} from "../constants/CookieConstants";

const AuthButton = (props) => {
  const handleAuthButtonClick = () => {
    CookieHelpers.removeCookie(SPOTIFY_ACCESS_TOKEN);
    window.location.assign(getSpotifyAuthCodeEndpoint());
  };

  if (props.accessToken) {
    return props.children;
  }

  let authorizationErrorJsx;
  if (props.authorizationError) {
    authorizationErrorJsx = (
        <div className="auth-error">
          understudy needs access to your Spotify account info to function.
        </div>
    );
  }

  let authorizationButtonJsx;
  if (!props.authorizationCode) {
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

AuthButton.propTypes = {
  authorizationCode: PropTypes.string,
  authorizationError: PropTypes.string,
  accessToken: PropTypes.string
};

export default AuthButton;