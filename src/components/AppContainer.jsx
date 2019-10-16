import React from "react";
import {isMobile, isChrome, isFirefox} from "react-device-detect";
import "./AppContainer.css";
import App from "./App";

const AppContainer = (props) => {
  let appJsx;
  if (isMobile) {
    appJsx = (
        <div className="device-error">
          understudy uses the Spotify Web Playback SDK, which is not supported on mobile devices
        </div>
    );
  } else if (!isChrome && !isFirefox) {
    appJsx = (
        <div className="device-error">
          understudy uses the Spotify Web Playback SDK, which is only supported on Chrome and Firefox
        </div>
    );
  } else {
    appJsx = <App />
  }

  return (
      <div className="app">
        <h1 className="title">understudy</h1>
        {appJsx}
      </div>
  );
};

export default AppContainer;