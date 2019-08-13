import React from 'react';
import './App.css';
import AuthScreen from './AuthScreen';
import {getUrlParamsMap} from "../util/URLHelpers";
import {
  getSpotifyAccessTokenEndpoint,
  getSpotifyRefreshAccessTokenEndpoint
} from "../resources/RestEndpoints";
import CookieHelpers from "../util/CookieHelpers";
import {
  SPOTIFY_ACCESS_TOKEN,
  SPOTIFY_REFRESH_TOKEN,
  SPOTIFY_ACCESS_TOKEN_EXPIRY
} from "../constants/CookieConstants";
import {handleErrors} from "../util/RestHelpers";

class App extends React.Component {
  constructor(props) {
    super(props);
    const urlParamsMap = getUrlParamsMap(window.location.href);
    this.refreshToken = CookieHelpers.getCookie(SPOTIFY_REFRESH_TOKEN);
    const accessTokenExpiry = CookieHelpers.getCookie(SPOTIFY_ACCESS_TOKEN_EXPIRY) || 0;
    this.accessTokenExpiresInMs = accessTokenExpiry - Date.now();
    if (this.refreshToken && this.accessTokenExpiresInMs > 0) {
      this.setRefreshAccessTokenTimeout();
    }
    this.state = {
      authorizationCode: urlParamsMap.get("code"),
      authorizationError: urlParamsMap.get("error"),
      accessToken: CookieHelpers.getCookie(SPOTIFY_ACCESS_TOKEN)
    };
  }

  setRefreshAccessTokenTimeout = () => {
    setTimeout(() => {
      this.getNewOrRefreshAccessToken(getSpotifyRefreshAccessTokenEndpoint(this.refreshToken));
    }, this.accessTokenExpiresInMs);
  };

  getNewOrRefreshAccessToken = (accessTokenEndpoint) => {
    fetch(accessTokenEndpoint, {
      method: "POST"
    })
    .then(handleErrors)
    .then((response) => {
      response.json().then((data) => {
        const {
          access_token,
          expires_in,
          refresh_token
        } = data;
        CookieHelpers.setCookie(
            SPOTIFY_ACCESS_TOKEN,
            access_token,
            {maxAge: expires_in}
        );
        // we set the access token to expire 1 minute earlier on our end than
        // on Spotify's end to give us some headspace for a refresh
        this.accessTokenExpiresInMs = (expires_in - 60) * 1000;
        CookieHelpers.setCookie(
            SPOTIFY_ACCESS_TOKEN_EXPIRY,
            Date.now() + this.accessTokenExpiresInMs,
            {maxAge: expires_in}
        );
        this.setState({accessToken: access_token});
        if (refresh_token) {
          CookieHelpers.setCookie(
              SPOTIFY_REFRESH_TOKEN,
              refresh_token
          );
          this.refreshToken = refresh_token;
        }
        this.setRefreshAccessTokenTimeout();
      });
    })
    .catch(() => {
      //TODO: throw custom exception on BE for bad request, log as warning and redirect
      window.location.assign("http://localhost:3000");
    });
  };

  render() {
    const {
      authorizationCode,
      authorizationError,
      accessToken
    } = this.state;
    if (authorizationCode && !accessToken) {
      this.getNewOrRefreshAccessToken(getSpotifyAccessTokenEndpoint(authorizationCode));
    }
    return (
        <div className="app">
          <h1 className="title">understudy</h1>
          <AuthScreen
              authorizationCode={authorizationCode}
              authorizationError={authorizationError}
              accessToken={accessToken} />
        </div>
    );
  }
}

export default App;
