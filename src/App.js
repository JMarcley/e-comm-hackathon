import React, { Component } from 'react';
import { Icon } from 'semantic-ui-react';
import './App.css';

import Store from './components/Store/Store';

class App extends Component {
  state = {
    media: "",
    // user: {
    //   name: 'guest'
    // },
    localStorage: {}
  }

  componentDidMount() {
    this.setMediaType();
    window.addEventListener('resize', this.setMediaType.bind(this))
  }

  setMediaType() {
    const width = window.innerWidth;
    this.setState({ media: width > 700 ? "computer" : "mobile/tablet" });
  }

  render() {
    const { media } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <p>
            hello
            <br />
            we sell things, check it out
          </p>
          <button className="scroll-button">
            <Icon name="angle double down" size="huge" inverted/>
          </button>
        </header>
        <Store media={media}/>
      </div>
    );
  }
}

export default App;
