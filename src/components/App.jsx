import React from 'react';
import './App.css';
import AuthScreen from './AuthScreen';
import {getUrlParamsMap} from "../util/URLHelpers";
import {
  getSpotifyAccessTokenEndpoint, getSpotifyLoggedInUserInfoEndpoint,
  getSpotifyRefreshAccessTokenEndpoint
} from "../resources/RestEndpoints";
import {
  SPOTIFY_ACCESS_TOKEN,
  SPOTIFY_REFRESH_TOKEN,
  SPOTIFY_ACCESS_TOKEN_EXPIRY,
  SPOTIFY_LOGGED_IN_USER_ID
} from "../constants/LocalStorageConstants";
import {handleErrors} from "../util/RestHelpers";

class App extends React.Component {
  constructor(props) {
    super(props);
    const urlParamsMap = getUrlParamsMap(window.location.href);
    this.refreshToken = window.localStorage.getItem(SPOTIFY_REFRESH_TOKEN);
    const accessTokenExpiry = window.localStorage.getItem(SPOTIFY_ACCESS_TOKEN_EXPIRY) || 0;
    this.accessTokenExpiresInMs = accessTokenExpiry - Date.now();
    if (this.refreshToken && this.accessTokenExpiresInMs > 0) {
      this.setRefreshAccessTokenTimeout();
    } else {
      this.clearLocalStorage();
    }
    this.state = {
      authorizationCode: urlParamsMap.get("code"),
      authorizationError: urlParamsMap.get("error"),
      accessToken: window.localStorage.getItem(SPOTIFY_ACCESS_TOKEN),
      loggedInUserId: window.localStorage.getItem(SPOTIFY_LOGGED_IN_USER_ID)
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
          window.localStorage.setItem(SPOTIFY_ACCESS_TOKEN, access_token);
          // we set the access token to expire 1 minute earlier on our end than
          // on Spotify's end to give us some headspace for a refresh
          this.accessTokenExpiresInMs = (expires_in - 60) * 1000;
          const accessTokenExpiry = Date.now() + this.accessTokenExpiresInMs;
          window.localStorage.setItem(SPOTIFY_ACCESS_TOKEN_EXPIRY, accessTokenExpiry);
          if (refresh_token) {
            window.localStorage.setItem(SPOTIFY_REFRESH_TOKEN, refresh_token);
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
        this.clearLocalStorage();
        window.location.assign("http://localhost:3000");
      });
    });
  };

  clearLocalStorage = () => {
    window.localStorage.removeItem(SPOTIFY_ACCESS_TOKEN);
    window.localStorage.removeItem(SPOTIFY_ACCESS_TOKEN_EXPIRY);
    window.localStorage.removeItem(SPOTIFY_REFRESH_TOKEN);
    window.localStorage.removeItem(SPOTIFY_LOGGED_IN_USER_ID);
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
          this.clearLocalStorage();
          this.setState({
            authorizationCode: "",
            authorizationError,
            accessToken: "",
          });
        } else {
          window.localStorage.setItem(SPOTIFY_LOGGED_IN_USER_ID, id);
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
