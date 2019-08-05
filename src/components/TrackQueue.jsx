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
      currentTrackIndex: 0
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isTrackOver
        && this.props.isTrackOver
        && this.state.currentTrackIndex < this.props.trackQueue.length) {
      const nextTrack = this.props.trackQueue[this.state.currentTrackIndex];
      this.playTrack(nextTrack.id);
    }
  }

  startQueue = () => {
    const firstTrack = this.props.trackQueue[0];
    this.playTrack(firstTrack.id);
    this.setState({isPlaying: true});
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
    .then(() => {
      this.setState({currentTrackIndex: this.state.currentTrackIndex + 1});
    })
    .catch((err) => {
      console.error(err);
    });
  };

  render() {
    let startQueueButtonJsx;
    if (!this.state.isPlaying && this.props.trackQueue.length > 0) {
      //TODO: add classnames dependency and dynamically hide button via css when clicked
      startQueueButtonJsx =
          <button
              className="start-button"
              onClick={this.startQueue}>
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
  trackQueue: PropTypes.array.isRequired,
  isTrackOver: PropTypes.bool.isRequired
};

export default TrackQueue;