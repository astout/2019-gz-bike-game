import React, { Component } from 'react';
import _ from 'lodash';

const MAX_HEIGHT = 475;
const PEAK_WATTS = 600;

function wattsBarStyle(watts) {
  let pct = watts / PEAK_WATTS;
  pct = _.min([pct, 1]);
  pct = _.max([pct, 0.01]);
  return {
    height: `${_.floor(MAX_HEIGHT * pct)}px`,
  };
}

class WattsMeter extends Component {
  render() {
    const { watts } = this.props;
    return (
      <div className="watts-meter-container block-center">
        <div className="watts-bar" style={wattsBarStyle(watts)}></div>
        <div className="watts-50"></div>
        <div className="watts-100"></div>
        <div className="watts-150"></div>
        <div className="watts-200"></div>
        <div className="watts-250"></div>
        <div className="watts-300"></div>
        <div className="watts-350"></div>
        <div className="watts-400"></div>
      </div>
    );
  }
}

export default WattsMeter;
