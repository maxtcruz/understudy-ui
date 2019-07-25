import React from 'react';
import PropTypes from 'prop-types';
import Script from "react-load-script";
import './Player.css';
import Content from "./Content";
import {loadPlayer} from "../util/SpotifyWebPlaybackSDKHelpers";

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deviceId: "",
      isTrackOver: false
    };
  }

  onSpotifyWebPlaybackSDKLoad = () => {
    loadPlayer().then(({Player}) => {
      const player = new Player({
        name: "understudy",
        getOAuthToken: (cb) => {
          cb(this.props.accessToken);
        }
      });
      player.addListener("player_state_changed", (state) => {
        this.setState({isTrackOver: state.paused});
      });
      player.addListener("ready", ({device_id}) => {
        this.setState({deviceId: device_id});
      });
      player.connect();
    })
  };

  render() {
    //TODO: pass player loading state to content
    const contentJsx = this.state.deviceId
        ? <Content
            accessToken={this.props.accessToken}
            deviceId={this.state.deviceId}
            isTrackOver={this.state.isTrackOver} />
        : <div className="loading">loading...</div>;
    return (
        <div className="player">
          <Script
              url="https://sdk.scdn.co/spotify-player.js"
              onError={(err) => {console.err(err)}}
              onLoad={this.onSpotifyWebPlaybackSDKLoad}
          />
          {contentJsx}
        </div>
    );
  }
}

Player.propTypes = {
  accessToken: PropTypes.string
};

export default Player;