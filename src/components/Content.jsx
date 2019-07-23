import React from 'react';
import PropTypes from 'prop-types';
import './Content.css';
import TrackSearcher from "./TrackSearcher";
import TrackQueue from "./TrackQueue";

class Content extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trackQueue: []
    }
  }

  addTrackToQueue = (trackInfo) => {
    const trackQueue = this.state.trackQueue.concat(trackInfo);
    this.setState({trackQueue});
  };

  render() {
    return (
        <div className="content">
          <TrackSearcher
              accessToken={this.props.accessToken}
              addTrackToQueue={this.addTrackToQueue} />
          <TrackQueue
              accessToken={this.props.accessToken}
              deviceId={this.props.deviceId}
              trackQueue={this.state.trackQueue} />
        </div>
    );
  }
}

Content.propTypes = {
  accessToken: PropTypes.string.isRequired,
  deviceId: PropTypes.string.isRequired
};

export default Content;