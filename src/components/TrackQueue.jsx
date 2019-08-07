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
      currentTrackIndex: -1
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isTrackOver
        && this.props.isTrackOver
        && this.state.currentTrackIndex < this.props.trackQueue.length - 1) {
      const nextTrack = this.findNextTrack();
      this.playTrack(nextTrack.id);
    }
  }

  findNextTrack = () => {
    const {trackQueue} = this.props;
    let index = this.state.currentTrackIndex + 1;
    while (trackQueue[index].softDeleted) {
      index++;
    }
    this.setState({currentTrackIndex: index});
    return trackQueue[index];
  };

  startQueue = () => {
    const firstTrack = this.findNextTrack();
    this.playTrack(firstTrack.id);
    this.props.onStart();
    this.setState({isPlaying: true});
  };

  playTrack = (trackId) => {
    const {deviceId, accessToken} = this.props;
    fetch(getSpotifyPlayEndpoint(deviceId), {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify({"uris": [`spotify:track:${trackId}`]})
    })
    .then(handleErrors)
    .catch((err) => {
      console.error(err);
    });
  };

  skip = () => {
    const {trackQueue, fillQueue} = this.props;
    const nextTrack = this.findNextTrack();
    this.playTrack(nextTrack.id);
    fillQueue(trackQueue, trackQueue[this.state.currentTrackIndex].id);
  };

  render() {
    const {trackQueue, fillQueue} = this.props;
    let startButtonJsx;
    if (!this.state.isPlaying && trackQueue.length > 0) {
      startButtonJsx = (
          <button
              className="start-button"
              onClick={this.startQueue}>
            start
          </button>
      );
    }
    let nowPlayingJsx;
    if (this.state.isPlaying) {
      nowPlayingJsx = (
          <div className="now-playing">
            <button
                onClick={this.skip}
                className="skip-button">
              skip
            </button>
            now playing: {this.state.currentTrackIndex > -1
              ? getTrackDisplayName(trackQueue[this.state.currentTrackIndex])
              : ""}
          </div>
      );
    }
    let upNextJsx;
    if (trackQueue.length > 0) {
      upNextJsx = (
          <h3 className="up-next">
            up next
          </h3>
      );
    }
    return (
        <div className="track-queue">
          <div className="track-queue-header">
            {startButtonJsx}
            {nowPlayingJsx}
            {upNextJsx}
          </div>
          <div>
            <ul>
              {trackQueue.map((track) => {
                if (track.index > this.state.currentTrackIndex && !track.softDeleted) {
                  return (
                      <li key={track.id}>
                        {getTrackDisplayName(track)}
                        <button onClick={() => {fillQueue(trackQueue, track.id)}}>remove</button>
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
  isTrackOver: PropTypes.bool.isRequired,
  onStart: PropTypes.func.isRequired,
  fillQueue: PropTypes.func.isRequired
};

export default TrackQueue;