import React from 'react';
import PropTypes from 'prop-types';
import './TrackQueue.css';
import {getTrackDisplayName} from "../util/SpotifyWebAPIHelpers";
import {getSpotifyPlayEndpoint} from "../resources/RestEndpoints";
import {handleErrors} from "../util/RestHelpers";

class TrackQueue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false,
      currentTrack: null
    }
  }

  startQueue = () => {
    this.setState({isPlaying: true});
    let currentTrack = this.state.currentTrack;
    if (!currentTrack) {
      currentTrack = this.props.trackQueue[0];
      this.setState({currentTrack});
    }
    this.playTrack(currentTrack.id);
  };

  playTrack = (trackId) => {
    fetch(getSpotifyPlayEndpoint(this.props.deviceId), {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${this.props.accessToken}`
      },
      body: JSON.stringify({"uris": [`spotify:track:${trackId}`]})
    })
    .then(handleErrors)
    .catch((err) => {
      console.error(err);
    });
  };

  render() {
    let startQueueButtonJsx;
    if (!this.state.isPlaying && this.props.trackQueue.length > 0) {
      startQueueButtonJsx =
          <button onClick={this.startQueue}>
            start
          </button>;
    }
    return (
        <div className="track-queue">
          {startQueueButtonJsx}
          <div>
            <ul>
              {this.props.trackQueue.map((trackInfo) => {
                return (
                    <li key={trackInfo.id}>
                      {getTrackDisplayName(trackInfo)}
                    </li>
                );
              })}
            </ul>
          </div>
        </div>
    );
  }
}

TrackQueue.propTypes = {
  accessToken: PropTypes.string.isRequired,
  deviceId: PropTypes.string.isRequired,
  trackQueue: PropTypes.array.isRequired
};

export default TrackQueue;