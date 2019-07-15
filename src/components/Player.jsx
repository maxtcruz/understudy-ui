import React from 'react';
import PropTypes from 'prop-types';
import Script from "react-load-script";
import './Player.css';
import {loadPlayer} from "../util/SpotifyWebPlaybackSDKHelpers";

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  onSpotifyWebPlaybackSDKLoad = () => {
    loadPlayer().then(({Player}) => {
      const player = new Player({
        name: "understudy",
        getOAuthToken: cb => { cb(this.props.accessToken); }
      });
      player.connect();
    })
  };

  render() {
    return (
        <div>
          <Script
              url="https://sdk.scdn.co/spotify-player.js"
              onError={(err) => {console.err(err)}}
              onLoad={this.onSpotifyWebPlaybackSDKLoad}
          />
        </div>
    );
  }
}

Player.propTypes = {
  accessToken: PropTypes.string
};

export default Player;