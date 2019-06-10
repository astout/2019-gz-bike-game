import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import _ from 'lodash';
import './Header.css';
import Logo from '../assets/gz-logo-white-horiz.png';

let socket;
class Header extends Component {
  constructor(props) {
    super(props);
    const host = _.get(window, 'location.hostname');
    const port = 5001;
    this.state = {
      endpoint: `http://${host}:${port}`,
    };

    console.log(`connecting to websocket '${this.state.endpoint}'`);
    socket = socketIOClient(this.state.endpoint);
    socket.on('connect', () => {
      console.log('WebSocket connected to TrainerPi');
    });
    socket.on('disconnect', () => {
      console.log('WebSocket disconnected from TrainerPi');
    });
  }

  render() {
    return (
      <div className="row">
        <div id='logo-container' className="col align-self-center">
          <img id='logo' src={Logo} alt="Logo" className="center" />
        </div>
      </div>
    );
  }
}

export { Header, socket };
