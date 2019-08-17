import React from 'react';
import PropTypes from 'prop-types';
import './Content.css';
import Clock from "./clock/Clock";
import TrackQueue from "./trackQueue/TrackQueue";

class Content extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      studyDurationMs: 0,
      timeElapsedMs: 0,
      isGenreSet: false,
      isStarted: false
    };
  }

  setStudyDurationMs = (ms) => {
    this.setState({studyDurationMs: ms});
  };

  onStart = () => {
    this.setState({isStarted: true});
    const clockTimer = setInterval(() => {
      if (this.state.timeElapsedMs < this.state.studyDurationMs) {
        this.setState({timeElapsedMs: this.state.timeElapsedMs + 1000});
      } else {
        clearInterval(clockTimer);
      }
    }, 1000);
  };

  onSetGenre = () => {
    this.setState({isGenreSet: true});
  };

  render() {
    return (
        <div className="content">
          <Clock
              studyDurationMs={this.state.studyDurationMs}
              timeElapsedMs={this.state.timeElapsedMs}
              isGenreSet={this.state.isGenreSet}
              onSetTime={this.setStudyDurationMs}
              onStart={this.onStart} />
          <TrackQueue
              accessToken={this.props.accessToken}
              deviceId={this.props.deviceId}
              loggedInUserId={this.props.loggedInUserId}
              searchResults={this.state.searchResults}
              studyDurationMs={this.state.studyDurationMs}
              isStarted={this.state.isStarted}
              isTrackOver={this.props.isTrackOver}
              onSetGenre={this.onSetGenre} />
        </div>
    );
  }
}

Content.propTypes = {
  accessToken: PropTypes.string.isRequired,
  deviceId: PropTypes.string.isRequired,
  isTrackOver: PropTypes.bool.isRequired,
  loggedInUserId: PropTypes.string.isRequired
};

export default Content;