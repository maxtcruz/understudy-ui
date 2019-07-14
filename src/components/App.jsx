import React from 'react';
import './App.css';
import Player from './Player';
import {getUrlParamsMap} from "../util/URLHelpers";
import {getSpotifyAccessTokenEndpoint} from "../constants/RestEndpoints";
import CookieHelpers from "../util/CookieHelpers";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.urlParamsMap = getUrlParamsMap(window.location.href);
  }

  render() {
    const authorizationCode = this.urlParamsMap.get("code");
    const authorizationError = this.urlParamsMap.get("error");
    let accessToken = CookieHelpers.getCookie("spotifyAccessToken");

    if (authorizationCode && !accessToken) {
      fetch(getSpotifyAccessTokenEndpoint(authorizationCode), {
        method: "POST"
      }).then((response) => {
        response.json().then((data) => {
          accessToken = data.access_token;
          CookieHelpers.setCookie("spotifyAccessToken", accessToken, {maxAge: data.expires_in});
        });
      }).catch((err) => {
        console.error(err);
      })
    }

    return (
        <div className="app">
          <h1>understudy</h1>
          <Player
              authorizationCode={authorizationCode}
              authorizationError={authorizationError}
              accessToken={accessToken} />
        </div>
    );
  }
}

export default App;
