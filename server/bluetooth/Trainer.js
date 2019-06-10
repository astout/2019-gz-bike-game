const _ = require('lodash');

const SESSION_TIME = 120;
const WS_TO_WH_DIVIDER = 60 * 60;

const Connection = {
  disconnected: 'disconnected',
  connected: 'connected',
  searching: 'searching',
};

function peripheralMap(peripheral = {}) {
  const p = _.pick(peripheral, 'id', 'rssi', 'state');
  p.name = _.get(peripheral, 'advertisement.localName', null);
  return p;
}

function trainerSchema(params = {}) {
  return _.defaults(params, {
    connection: Connection.disconnected,
    lastSync: null,
    watts: 0,
    peakWatts: 0,
    wh: 0.0,
    time: SESSION_TIME,
    readings: [],
  });
}

class Trainer {
  constructor(peripheral = {}, socket = {}, params = {}) {
    _.assign(this, trainerSchema(params));

    this.peripheral = peripheral;
    this.socket = socket;
    this.timer = null;

    this.socket.on('connection', (client) => {
      client.on('trainer.sessionStart', () => {
        console.log('session start requested');
        this.startSession();
      });
      client.on('trainer.sessionStop', () => {
        console.log('session stop requested');
        this.stopSession();
      });
      client.on('trainer.sessionResume', () => {
        console.log('session resume requested');
        this.resumeSession();
      });
      client.on('trainer.data', () => {
        console.log('trainer data requested');
        this.emitData();
      });
    });
  }

  getData() {
    return {
      ...(_.pick(this, _.keys(trainerSchema()))),
      peripheral: peripheralMap(this.peripheral),
      isRunning: (this.timer !== null),
    };
  }

  isConnected() {
    return this.connection === Connection.connected;
  }

  setPeripheral(peripheral = {}) {
    console.log('set peripheral');
    this.peripheral = peripheral;
    // _.assign(this, trainerSchema({}));
    this.resetState();
    this.setConnection(Connection.connected);
  }

  emitData() {
    this.socket.emit('trainer.onData', this.getData());
  }

  setConnection(connection = Connection.disconnected) {
    this.connection = _.defaultTo(connection, Connection.disconnected);
    this.emitData();
  }

  onTick() {
    this.readings.push(this.watts);
    this.wh = _.sum(this.readings) / WS_TO_WH_DIVIDER;
    this.time = this.time > 0 ? this.time - 1 : 0;
    this.peakWatts = _.max([this.watts, this.peakWatts]);
    console.log('tick', this.time);
    if (this.time <= 0) {
      this.stopSession();
    } else {
      this.emitData();
    }
  }

  resetState() {
    console.log('resetting state', this.timer);
    if (this.timer) {
      this.stopSession();
    }
    const defaults = trainerSchema();
    this.watts = defaults.watts;
    this.peakWatts = defaults.peakWatts;
    this.wh = defaults.wh;
    this.time = defaults.time;
    this.readings = defaults.readings;
  }

  startSession() {
    console.log('starting session');
    this.resetState();
    this.resumeSession();
  }

  resumeSession() {
    this.timer = setInterval(() => this.onTick(), 1000);
    console.log('session started');
    this.socket.emit('trainer.onSessionStart', this.getData());
  }

  stopSession() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      console.log('session stopped', _.omit(this, 'peripheral', 'socket'));
      this.socket.emit('trainer.onSessionStop', this.getData());
    }
  }

  peripheralConnectEvent() {
    this.setConnection(Connection.connected);
  }

  peripheralDisconnectEvent() {
    this.setConnection(Connection.disconnected);
  }

  onScanStart() {
    this.setConnection(Connection.searching);
  }

  onCycleWatts(watts) {
    // console.log(watts);
    this.lastSync = new Date();
    this.watts = _.defaultTo(watts, 0);
    // this.watts = _.random(0, 350);
  }
}

module.exports = Trainer;
