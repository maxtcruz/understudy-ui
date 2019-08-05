import React from 'react';
import PropTypes from 'prop-types';
import classnames from "classnames";
import './TrackQueue.css';
import {getTrackDisplayName} from "../util/SpotifyWebAPIHelpers";
import {getSpotifyPlayEndpoint} from "../resources/RestEndpoints";
import {handleErrors} from "../util/RestHelpers";

class TrackQueue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false,
      nextTrackIndex: 0
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isTrackOver
        && this.props.isTrackOver
        && this.state.nextTrackIndex < this.props.trackQueue.length) {
      const nextTrack = this.props.trackQueue[this.state.nextTrackIndex];
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
      this.setState({nextTrackIndex: this.state.nextTrackIndex + 1});
    })
    .catch((err) => {
      console.error(err);
    });
  };

  render() {
    const startButtonClassName = classnames("start-button", {
      "hide-element": this.state.isPlaying || this.props.trackQueue.length === 0
    });
    const nowPlayingClassname = classnames({
      "hide-element": !this.state.isPlaying
    });
    const upNextClassName = classnames("up-next", {
      "hide-element": this.props.trackQueue.length === 0
    });
    return (
        <div className="track-queue">
          <div className="track-queue-header">
            <button
                className={startButtonClassName}
                onClick={this.startQueue}>
              start
            </button>
            <div className={nowPlayingClassname}>
              now playing {this.state.nextTrackIndex > 0
                ? getTrackDisplayName(this.props.trackQueue[this.state.nextTrackIndex - 1])
                : ""}
            </div>
            <h3 className={upNextClassName}>up next</h3>
          </div>
          <div>
            <ul>
              {this.props.trackQueue.map((trackInfo) => {
                if (trackInfo.index >= this.state.nextTrackIndex) {
                  return (
                      <li key={trackInfo.id}>
                        {getTrackDisplayName(trackInfo)}
                      </li>
                  );
                } else {
                  return null;
                }
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