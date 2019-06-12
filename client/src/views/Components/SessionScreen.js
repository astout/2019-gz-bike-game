import React, { Component } from 'react';
import _ from 'lodash';
import WattsMeter from './WattsMeter';
import StopButton from './StopButton';

import {
  renderMilliseconds,
  renderMinutes,
  renderSeconds,
  renderWatts,
  renderWh,
  // efficiencyImgWatts,
  efficiencyImgWattHours,
} from '../../utils';

class SessionScreen extends Component {
  render() {
    const { watts, wh, time, onStopClick } = this.props;
    const img = efficiencyImgWattHours(wh);
    // const img = efficiencyImgWatts(watts);
    return (
      <div className="row">
        <div className="col">
          <div className="row">
            <p className="session-watts text-center">{renderWatts(watts)} W</p>
          </div>
          <div className="row">
            <WattsMeter watts={watts} />
          </div>
        </div>
        <div className="col">
          <div className="row session-time block-center">
            <div className="session-time-wrapper">
              <span className="session-minutes">{renderMinutes(time)}</span>
              <span className="session-minutes-divider">:</span>
              <span className="session-seconds">{renderSeconds(time)}</span>
              <span className="session-milliseconds-divider">.</span>
              <span className="session-milliseconds">{renderMilliseconds(time)}</span>
            </div>
          </div>
          <p className="session-wh text-center">{renderWh(wh)} Wh</p>
          <div className="row session-efficiency-comparison">
            <div className="block-center">
              <img src={img} alt="Efficiency Image" />
            </div>
          </div>
          <div className="row" style={{ marginTop: '25px' }}>
            <StopButton onClick={onStopClick} />
          </div>
        </div>
      </div>
    );
  }
}

export default SessionScreen;
