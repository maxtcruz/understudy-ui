import React from 'react';
import './App.css';
import Player from './components/Player';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <div className="app">
          <h1>understudy</h1>
          <Player hasAuthorizationCode={false} />
        </div>
    );
  }
}

export default App;
