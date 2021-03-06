const noble = require('@abandonware/noble');
const _ = require('lodash');
const Trainer = require('./Trainer');
const profile = require('./config');

let BTState = {
  isScanning: false,
  websocket: null,
  trainer: null,
  isConnecting: false,
  reconnectTimer: null,
};

BTState.isReady = function() {
  return _.defaultTo(_.invoke(BTState, 'trainer.isConnected'), false); 
};

BTState.getTrainer = function() {
  return _.invoke(BTState, 'trainer.getData');
};

function startScanning() {
  noble.startScanning();
}

function stopScanning() {
  noble.stopScanning();
}

function onScanStart() {
  console.log('Bluetooth - Scan Started');
  BTState.isScanning = true;
  _.invoke(BTState, 'trainer.onScanStart');
}

function onScanStop() {
  console.log('Bluetooth - Scan Stopped');
  BTState.isScanning = false;
  startReconnectTimer();
}

function onStateChange(state) {
  console.log('Bluetooth stateChange event: ', state);
  if (state === 'poweredOn' && BTState.isScanning === false && BTState.isReady() === false) {
    startScanning();
  }
}

function startReconnectTimer() {
  clearInterval(BTState.reconnectTimer);
  BTState.reconnectTimer = setInterval(() => {
    if (BTState.isReady() === false && BTState.isScanning === false) {
      // _.values(noble._peripherals, (p) => _.invoke(p, 'disconnect'));
      const p = _.get(BTState, 'trainer.peripheral');
      if (connectPeripheral(p) === false) {
        startScanning();
      }
    }
  }, 10000);
}

function connectPeripheral(peripheral = {}) {
  if (_.isEmpty(peripheral) || !_.isFunction(peripheral.connect)) {
    return false;
  }
  if (BTState.isScanning) {
    stopScanning();
  }
  startReconnectTimer(); // reset
  if (_.get(peripheral, 'state') === 'connecting') {
    console.log(`waiting for peripheral '${peripheral.id}'`);
    return true;
  }
  // _.values(noble._peripherals, (p) => _.invoke(p, 'disconnect'));
  console.log(`exploring peripheral '${peripheral.id}'`);
  peripheral.connect((connectErr) => {
    if (connectErr) {
      console.error(`Could not connect to peripheral '${peripheral.id}'`);
      console.error(connectErr);
      startScanning();
    }
    onPeripheralConnect(peripheral);
  });
  return true;
}

const logWaitingMsg = _.debounce(() => {
  console.log('Searching for peripherals that match profile');
}, 10 * 1000);

function onPeripheralDiscover(peripheral = {}) {
  if (_.isEmpty(peripheral) || BTState.isReady()) {
    return;
  }
  if (_.isEmpty(peripheral.id)) {
    return false;
  }
  console.log(_.pick(peripheral, 'id', 'advertisement'));
  const name = _.get(peripheral, 'advertisement.localName');
  // let services = _.get(peripheral, 'advertisement.serviceUuids', []).map((id) => ({ id }));
  let { id } = peripheral;
  if (matchKickr(peripheral)) {
    // if (matchPeripheral(peripheral) || _.some(services, matchService)) {
    console.log(`found new matching peripheral: '${id}' '${name}'`);
    connectPeripheral(peripheral);
  } else {
    logWaitingMsg();
  }
}

function onServicesDiscovery(services = [], peripheral = {}) {
  if (_.isEmpty(peripheral)) {
    console.error('Services discovered for unknown device');
    return;
  }
  if (_.isEmpty(services)) {
    console.error(`No services advertised for Peripheral '${peripheral.id}'`);
    return;
  }
  startReconnectTimer();
  services.forEach((s = {}) => {
    const service = _.defaults(s, { id: _.get(s, 'uuid', null) });
    if (_.isFunction(service.discoverCharacteristics)) {
      console.log(`Exploring Characteristics for Peripheral '${peripheral.id}', Service: '${service.id}' ${service.name ? service.name : ''}`);
      if (!_.isEmpty(service.characteristics)) {
        onCharacteristicsDiscovery(service.characteristics, service, peripheral);
      }
      service.discoverCharacteristics([], (discoverCharacteristicsError, characteristics) => {
        if (discoverCharacteristicsError) {
          console.error(`Error discovering characteristics for Peripheral '${peripheral.id}', Service: '${service.id}'`);
          console.error(discoverCharacteristicsError);
          return;
        }
        return onCharacteristicsDiscovery(characteristics, service, peripheral);
      });
    }
  });
}

function onCharacteristicsDiscovery(characteristics, service, peripheral) {
  if (_.isEmpty(peripheral)) {
    console.error('Characteristics discovered for unknown device');
    return;
  }
  if (_.isEmpty(service)) {
    console.error(`'Characteristics discovered for unknown service on Peripheral '${peripheral.id}'`);
    return;
  }
  if (_.isEmpty(characteristics)) {
    console.error(`No characteristics advertised for Service '${service.id}' (${service.name ? service.name : ''}) on Peripheral '${peripheral.id}'`);
    return;
  }
  startReconnectTimer();
  characteristics.forEach((c = {}) => {
    const characteristic = _.defaults(c, { id: _.get(c, 'uuid', null) });
    if (_.isEmpty(characteristic)) {
      return;
    }
    console.log(`Characteristic: ${characteristic.id || '<NULL>'}, (${characteristic.name || '<NULL>'})`);
    if (isCpmCharacteristic(characteristic) && _.isFunction(characteristic.subscribe)) {
      console.log(`Subscribing Cycling Power Measurement Characteristic '${characteristic.id}' on Peripheral '${peripheral.id}'`);
      characteristic.subscribe((subscribeCharacteristicError) => {
        if (subscribeCharacteristicError) {
          console.error(`Error subscribing characteristic for Peripheral '${peripheral.id}', Service: '${service.id}'`);
          console.error(subscribeCharacteristicError);
          return;
        }
        characteristic.on('data', (data) => {
          onCpmNotify(data, peripheral, service, characteristic);
        });
      });
      return characteristic;
    } else if (isCpcpCharacteristic(characteristic) && _.isFunction(characteristic.subscribe)) {
      console.log(`Subscribing Cycling Power Control Point Characteristic '${characteristic.id}' on Peripheral '${peripheral.id}'`);
      characteristic.subscribe((subscribeCharacteristicError) => {
        if (subscribeCharacteristicError) {
          console.error(`Error subscribing characteristic for Peripheral '${peripheral.id}', Service: '${service.id}'`);
          console.error(subscribeCharacteristicError);
          return;
        }
        characteristic.on('data', (data) => {
          onCpcpIndicate(data, peripheral, service, characteristic);
        });
      });
      return characteristic;
    }
  });
}

function onPeripheralConnect(peripheral = {}) {
  if (_.isEmpty(peripheral)) {
    console.error('unknown peripheral connect event');
    return;
  }
  startReconnectTimer(); // reset
  console.log(`Peripheral '${peripheral.id}' Connected`);
  peripheral.on('disconnect', () => {
    onPeripheralDisconnect(peripheral);
  });
  console.log(`Scanning services for Peripheral: '${peripheral.id}'`);
  peripheral.discoverServices([], (discoverServicesError, services) => {
    if (discoverServicesError) {
      console.error(`Error discovering services for Peripheral '${peripheral.id}'`);
      console.error(discoverServicesError);
      return;
    }
    return onServicesDiscovery(services, peripheral);
  });
}

function onPeripheralDisconnect(peripheral = {}) {
  let id = _.get(peripheral, 'id', null);
  if (id === null) {
    console.error('unknown peripheral disconnect');
    return;
  }
  console.log(`Peripheral '${id}' Disconnected`);
  if (_.get(BTState, 'trainer.peripheral.id') === id) {
    _.invoke(BTState, 'trainer.peripheralDisconnectEvent');
  //   if (!BTState.isScanning) {
  //     _.invoke(BTState, 'trainer.onScanStart');
  //     connectPeripheral(peripheral);
  //     return;
  //   }
  }
  // if (!BTState.isReady()) {
  //   startScanning();
  // }
}

function matchKickr(peripheral) {
  const name = _.get(peripheral, 'advertisement.localName', '');
  return (name.includes(profile.KICKR_ID));
}

function matchPeripheral(peripheral) {
  const peripherals = _.values(profile.peripherals);
  if (_.isEmpty(peripherals) || _.isEmpty(peripheral)) {
    return false;
  }
  return _.some(peripherals, (p) => {
    return (p.id === peripheral.id) || (p.name.toLowerCase() === (peripheral.name || '').toLowerCase());
  });
}

function matchService(service) {
  const services = _.values(profile.services);
  if (_.isEmpty(services) || _.isEmpty(service)) {
    return false;
  }
  return _.some(services, (s) => {
    return (s.id === service.id) || (s.name.toLowerCase() === (service.name || '').toLowerCase());
  });
}

function matchCharacteristic(characteristic) {
  const characteristics = _.values(profile.characteristics);
  if (_.isEmpty(characteristics) || _.isEmpty(characteristic)) {
    return false;
  }
  return _.some(characteristics, (c) => {
    return (c.id === characteristic.id) || (c.name.toLowerCase() === (characteristic.name || '').toLowerCase());
  });
}

function isCpmCharacteristic(characteristic) {
  const cpmCharId = _.get(profile, 'characteristics.CyclingPowerMeasurement.id');
  if (cpmCharId === characteristic.id) {
    return true;
  }
  return false;
}

function isCpcpCharacteristic(characteristic) {
  const cpcpCharId = _.get(profile, 'characteristics.CyclingPowerControlPoint.id');
  if (cpcpCharId === characteristic.id) {
    return true;
  }
  return false;
}

function onCpmNotify(data, peripheral, service, characteristic) {
  console.log('Cycling Power Event');
  if (_.isEmpty(data)) {
    return;
  }
  startReconnectTimer(); // reset
  if (BTState.isReady()) {
    if (BTState.isScanning) {
      stopScanning();
    }
    if (_.get(BTState, 'trainer.peripheral.id') === peripheral.id) {
      _.invoke(BTState, 'trainer.onCycleWatts', data[2]);

    }
  } else {
    _.invoke(BTState, 'trainer.setPeripheral', peripheral);
  }

  // console.log(`Peripheral: '${peripheral.id}', Service: '${service.name || service.id}', Characteristic: '${characteristic.name || characteristic.id}'`);
  // console.log(data, data.length);
  // console.log(data.toString('hex'));
  console.log(data[2], data[3]);
  // console.log(data);
}

function onCpcpIndicate(data, peripheral, service, characteristic) {
  console.log('control point indicate event');
  if (_.isEmpty(data)) {
    return;
  }
  console.log(`Peripheral: '${peripheral.id}', Service: '${service.name || service.id}', Characteristic: '${characteristic.name || characteristic.id}'`);
  console.log(data, data.length);
  console.log(data.toString('hex'));
}

BTState.init = function(SocketIO) {
  if (_.isEmpty(SocketIO)) {
    throw new Error('Socket module required to initialize Bluetooth Interface');
  }
  BTState.websocket = SocketIO;
  noble.on('stateChange', onStateChange);
  noble.on('discover', onPeripheralDiscover);
  noble.on('scanStart', onScanStart);
  noble.on('scanStop', onScanStop);
  BTState.trainer = new Trainer({}, SocketIO);
  return BTState;
};

BTState.scan = function() {
  if (!BTState.isScanning) {
    startScanning();
  }
};

module.exports = BTState.init;
