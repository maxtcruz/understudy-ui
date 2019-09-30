import React from "react";
import PropTypes from "prop-types";
import "./NowPlaying.css";
import {getFormattedTrackName} from "../../../util/SpotifyWebAPIHelpers";

class NowPlaying extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      skipButtonDisabled: false
    };
  }

  onSkip = () => {
    this.props.skip();
    this.setState({skipButtonDisabled: true}, () => {
      setTimeout(() => {
        this.setState({skipButtonDisabled: false});
      }, 500)
    })
  };

  render() {
    const {
      currentTrackIndex,
      trackQueue
    } = this.props;
    return (
        <div className="now-playing-container">
        <span className="now-playing">
        <button
            onClick={this.onSkip}
            disabled={this.state.skipButtonDisabled}
            className="skip-button">
          skip
        </button>
        <b>now playing:</b> {currentTrackIndex > -1
            ? getFormattedTrackName(trackQueue[currentTrackIndex])
            : ""}
        </span>
        </div>
    );
  }

}

NowPlaying.propTypes = {
  skip: PropTypes.func.isRequired,
  currentTrackIndex: PropTypes.number.isRequired,
  trackQueue: PropTypes.array.isRequired
};

export default NowPlaying;