import React, { Component } from 'react';
import _ from 'lodash';
import './TrainerOverview.css';
import { socket } from './Header';
// import BicycleIcon from '../assets/bicycle-icon.png';
import BicycleZoom from '../assets/bicycle-zoom.png';
import ConnectButton from './ConnectButton';
import SessionCountDown from './SessionCountDown';
import SessionScreen from './SessionScreen';
import SessionEndScreen from './SessionEndScreen';
import {
  PRECISION_TIME_MS,
  SESSION_TIME_S,
  Connection,
  Screen,
} from '../../constants';

function trainerSchema(params = {}) {
  return _.defaults(params, {
    isRunning: false,
    connection: Connection.disconnected,
    lastSync: null,
    watts: 0,
    peakWatts: 0,
    wh: 0.0,
    time: 120,
    readings: [],
  });
}

function stateSchema(params = {}) {
  return _.defaults(params, {
    connectionInterval: null,
    connection: Connection.disconnected,
    precisionTime: PRECISION_TIME_MS,
    precisionTimer: null,
    screen: Screen.start,
    trainer: trainerSchema(),
  });
}

class TrainerOverview extends Component {
  constructor(props) {
    super(props);
    this.state = stateSchema();

    this.onConnectionReceived = this.onConnectionReceived.bind(this);
    this.onTrainerDataReceived = this.onTrainerDataReceived.bind(this);
    this.checkConnection = this.checkConnection.bind(this);
    this.onStartClick = this.onStartClick.bind(this);
    this.onStopClick = this.onStopClick.bind(this);
    this.onResetClick = this.onResetClick.bind(this);
    this.onSessionStart = this.onSessionStart.bind(this);
    this.onSessionStop = this.onSessionStop.bind(this);
    this.startSession = this.startSession.bind(this);
    this.stopSession = this.stopSession.bind(this);
    this.sendStart = this.sendStart.bind(this);
    this.sendStop = this.sendStop.bind(this);
    this.onPrecisionTime = this.onPrecisionTime.bind(this);
    this.startup = this.startup.bind(this);
    this.cleanup = this.cleanup.bind(this);
  }

  startup() {
    socket.on('trainer.onConnection', this.onConnectionReceived);
    socket.on('trainer.onData', this.onTrainerDataReceived);
    socket.on('trainer.onSessionStart', this.onSessionStart);
    socket.on('trainer.onSessionStop', this.onSessionStop);
    clearInterval(this.state.connectionInterval);
    clearInterval(this.state.precisionTimer);
    this.setState({
      connectionInterval: setInterval(this.checkConnection, 1000),
    });
  }

  cleanup() {
    socket.off('trainer.onConnection');
    socket.off('trainer.onData');
    socket.off('trainer.onSessionStart');
    socket.off('trainer.onSessionStop');
    clearInterval(this.state.connectionInterval);
    clearInterval(this.state.precisionTimer);
    this.setState(stateSchema());
  }

  componentDidMount() {
    socket.on('connect', () => {
      this.startup();
    });
    socket.on('disconnect', () => {
      this.cleanup();
    });
    this.startup();
  }

  onPrecisionTime() {
    let { precisionTime } = this.state;
    precisionTime = precisionTime > 0 ? precisionTime - 10 : 0;
    this.setState({
      precisionTime,
    });
  }

  onConnectionReceived(newConnection) {
    console.log("connection status rx'd", newConnection);
    let { connection, connectionInterval } = this.state;
    if (connection !== Connection.connected && newConnection === Connection.connected) {
      clearInterval(connectionInterval);
      connectionInterval = setInterval(this.checkConnection, 7000);
    }
    this.setState({
      connection: Connection[newConnection] || Connection.disconnected,
      connectionInterval,
    });
  }

  onTrainerDataReceived(trainer = {}) {
    console.log("trainer data rx'd", trainer);
    let connection = _.get(trainer, 'connection', Connection.disconnected);
    if (connection !== this.state.connected) {
      this.onConnectionReceived(connection);
    }
    let currentlyIsRunning = _.get(this, 'state.trainer.isRunning', false);
    let isRunning = _.get(trainer, 'isRunning', false);
    if (isRunning !== currentlyIsRunning) {
      if (isRunning) {
        this.startSession();
      } else {
        this.stopSession();
      }
    }
    if (!_.isEmpty(trainer)) {
      let { precisionTime } = this.state;
      const time = _.get(trainer, 'time', _.floor(precisionTime / 1000));
      this.setState({
        trainer,
        precisionTime: time * 1000,
      });
    }
  }

  startSession() {
    if (this.state.precisionTimer) {
      clearInterval(this.state.precisionTimer);
    }
    this.setState({
      screen: Screen.session,
      precisionTimer: setInterval(this.onPrecisionTime, 10),
    });
  }

  stopSession() {
    if (this.state.precisionTimer) {
      clearInterval(this.state.precisionTimer);
    }
    this.setState({
      screen: Screen.sessionEnd,
      precisionTime: PRECISION_TIME_MS,
      precisionTimer: null,
    });
  }

  onSessionStart(trainer = {}) {
    this.startSession();
    this.onTrainerDataReceived(trainer);
  }

  onSessionStop(trainer = {}) {
    this.stopSession();
    this.onTrainerDataReceived(trainer);
  }

  onStartClick() {
    this.setState({
      screen: Screen.countDown,
    });
  }

  onStopClick() {
    this.sendStop();
  }

  onResetClick() {
    console.log('reset click');
    this.setState({
      screen: Screen.start,
    });
  }

  checkConnection() {
    socket.emit('trainer.data');
  }

  sendStart() {
    console.log('send start');
    socket.emit('trainer.sessionStart');
  }

  sendStop() {
    console.log('send stop');
    socket.emit('trainer.sessionStop');
  }

  componentWillUnmount() {
    this.cleanup();
  }

  renderStartScreen() {
    const { connection } = this.state;
    return (
      <div className="trainer-overview">
        <img className="bicycle-icon block-center" src={BicycleZoom} alt="Bicycle Zoom Logo" />
        <ConnectButton onClick={this.onStartClick} status={connection}/>
      </div>
    );
  }

  renderCountDownScreen() {
    return (
      <SessionCountDown onFinish={this.sendStart} />
    );
  }

  renderSessionScreen() {
    const watts = _.get(this, 'state.trainer.watts', 0);
    const wh = _.get(this, 'state.trainer.wh', 0.0);
    const time = _.get(this, 'state.precisionTime', 0);
    return (
      <SessionScreen watts={watts} wh={wh} time={time} onStopClick={this.onStopClick} />
    );
  }

  renderSessionEndScreen() {
    const { wh, time, peakWatts } = trainerSchema(this.state.trainer);
    return (
      <SessionEndScreen onResetClick={this.onResetClick} wh={wh} time={SESSION_TIME_S - time} peakWatts={peakWatts}/>
    );
  }

  render() {
    const { screen } = this.state;
    switch (screen) {
      case Screen.countDown:
        return this.renderCountDownScreen();
      case Screen.session:
        return this.renderSessionScreen();
      case Screen.sessionEnd:
        return this.renderSessionEndScreen();
      default:
        return this.renderStartScreen();
    }
  }
}

export default TrainerOverview;
