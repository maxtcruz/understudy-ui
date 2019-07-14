import React from 'react';
import './App.css';
import AuthButton from './AuthButton';
import {getUrlParamsMap} from "../util/URLHelpers";
import {getSpotifyAccessTokenEndpoint} from "../resources/RestEndpoints";
import CookieHelpers from "../util/CookieHelpers";
import {SPOTIFY_ACCESS_TOKEN} from "../constants/CookieConstants";
import {handleErrors} from "../util/RestHelpers";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.urlParamsMap = getUrlParamsMap(window.location.href);
    this.state = {
      authorizationCode: this.urlParamsMap.get("code"),
      authorizationError: this.urlParamsMap.get("error"),
      accessToken: CookieHelpers.getCookie(SPOTIFY_ACCESS_TOKEN)
    }
  }

  render() {
    const {authorizationCode, authorizationError, accessToken} = this.state;
    if (authorizationCode && !accessToken) {
      fetch(getSpotifyAccessTokenEndpoint(authorizationCode), {
        method: "POST"
      })
      .then(handleErrors)
      .then((response) => {
        response.json().then((data) => {
          CookieHelpers.setCookie(SPOTIFY_ACCESS_TOKEN, data.access_token, {maxAge: data.expires_in});
          this.setState({accessToken: data.access_token});
        });
      })
      .catch((err) => {
        //TODO: throw custom exception on BE for bad request, log as warning and redirect
        window.location.assign("http://localhost:3000");
      })
    }

    return (
        <div className="app">
          <h1>understudy</h1>
          <AuthButton
              authorizationCode={authorizationCode}
              authorizationError={authorizationError}
              accessToken={accessToken}>
            access token available
          </AuthButton>
        </div>
    );
  }
}

export default App;
