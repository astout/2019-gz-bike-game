const _ = require('lodash');

const cp_characteristics = {
  CyclingPowerMeasurement: {
    id: '2a63',
    name: 'Cycling Power Measurement',
  },
  CyclingPowerControlPoint: {
    id: '2a66',
    name: 'Cycling Power Control Point',
  },
};

const csc_characteristics = {
  SpeedCadenceControlPoint: {
    id: '2a5d',
    name: 'Speed and Cadence Control Point',
  },
  SpeedCadenceMeasurement: {
    id: '2a5b',
    name: 'Speed and Cadence Measurement',
  },
};

const services = {
  CyclingPower: {
    id: '1818',
    name: 'Cycling Power',
    cp_characteristics,
  },
  CyclingSpeedAndCadence: {
    id: '1816',
    name: 'Cycling Speed and Cadence',
    csc_characteristics,
  },
};

const peripherals = {
  WahooKickr: {
    id: '19e476a238f66c2677612bab3a04a371',
    name: 'Wahoo KICKR',
    services,
  },
};

module.exports = {
  peripherals,
  services,
  characteristics: _.defaults({}, cp_characteristics, csc_characteristics),
};
