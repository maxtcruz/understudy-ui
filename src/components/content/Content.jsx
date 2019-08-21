import React from 'react';
import PropTypes from 'prop-types';
import './Content.css';
import SessionConfig from "./sessionConfig/SessionConfig";
import TrackQueue from "./trackQueue/TrackQueue";

class Content extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      studyDurationMs: 0,
      genre: "",
      isStarted: false
    };
  }

  onSetTime = (ms) => {
    this.setState({studyDurationMs: ms});
  };

  onSetGenre = (genre) => {
    this.setState({genre});
  };

  onStart = () => {
    this.setState({isStarted: true});
  };

  render() {
    return (
        <div className="content">
          <SessionConfig
              studyDurationMs={this.state.studyDurationMs}
              genre={this.state.genre}
              isStarted={this.state.isStarted}
              onSetTime={this.onSetTime}
              onSetGenre={this.onSetGenre}
              onStart={this.onStart} />
          <TrackQueue
              accessToken={this.props.accessToken}
              deviceId={this.props.deviceId}
              loggedInUserId={this.props.loggedInUserId}
              searchResults={this.state.searchResults}
              studyDurationMs={this.state.studyDurationMs}
              genre={this.state.genre}
              isStarted={this.state.isStarted}
              isTrackOver={this.props.isTrackOver} />
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