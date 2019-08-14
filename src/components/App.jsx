import React from 'react';
import './App.css';
import AuthScreen from './AuthScreen';
import {getUrlParamsMap} from "../util/URLHelpers";
import {
  getSpotifyAccessTokenEndpoint, getSpotifyLoggedInUserInfoEndpoint,
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
      accessToken: CookieHelpers.getCookie(SPOTIFY_ACCESS_TOKEN),
      loggedInUserId: ""
    };
  }

  setRefreshAccessTokenTimeout = () => {
    setTimeout(() => {
      this.getNewOrRefreshAccessToken(getSpotifyRefreshAccessTokenEndpoint(this.refreshToken));
    }, this.accessTokenExpiresInMs);
  };

  getNewOrRefreshAccessToken = (accessTokenEndpoint) => {
    return new Promise((resolve) => {
      fetch(accessTokenEndpoint, {
        method: "POST"
      })
      .then(handleErrors)
      .then((response) => {
        response.json()
        .then((data) => {
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
          if (refresh_token) {
            CookieHelpers.setCookie(
                SPOTIFY_REFRESH_TOKEN,
                refresh_token
            );
            this.refreshToken = refresh_token;
          }
          this.setRefreshAccessTokenTimeout();
          this.setState({accessToken: access_token}, () => {
            resolve();
          });
        });
      })
      .catch(() => {
        //TODO: throw custom exception on BE for bad request, log as warning and redirect
        window.location.assign("http://localhost:3000");
      });
    });
  };

  getLoggedInUserInfo = () => {
    fetch(getSpotifyLoggedInUserInfoEndpoint(), {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${this.state.accessToken}`
      }
    })
    .then(handleErrors)
    .then((response) => {
      response.json()
      .then((data) => {
        const {
          id,
          product
        } = data;
        if (product !== "premium") {
          const authorizationError = "understudy requires a premium Spotify account";
          CookieHelpers.removeCookie(SPOTIFY_ACCESS_TOKEN);
          CookieHelpers.removeCookie(SPOTIFY_ACCESS_TOKEN_EXPIRY);
          CookieHelpers.removeCookie(SPOTIFY_REFRESH_TOKEN);
          this.setState({
            authorizationCode: "",
            authorizationError,
            accessToken: "",
          });
        } else {
          this.setState({loggedInUserId: id});
        }
      });
    })
    .catch((err) => {
      console.error(err);
    });
  };

  render() {
    const {
      authorizationCode,
      authorizationError,
      accessToken,
      loggedInUserId
    } = this.state;
    //TODO: consider moving all of this to constructor?
    if (authorizationCode && !accessToken) {
      this.getNewOrRefreshAccessToken(getSpotifyAccessTokenEndpoint(authorizationCode))
      .then(() => {
        this.getLoggedInUserInfo();
      });
    } else if (accessToken && !loggedInUserId) {
      this.getLoggedInUserInfo();
    }
    return (
        <div className="app">
          <h1 className="title">understudy</h1>
          <AuthScreen
              authorizationCode={authorizationCode}
              authorizationError={authorizationError}
              accessToken={accessToken}
              loggedInUserId={loggedInUserId} />
        </div>
    );
  }
}

export default App;
