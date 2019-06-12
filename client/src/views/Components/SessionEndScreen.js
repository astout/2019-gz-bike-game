import React, { Component } from 'react';
import ResetButton from './ResetButton';
import _ from 'lodash';
import {
  renderWh,
  renderMinSec,
  renderWatts,
  efficiencyImgWattHours,
  efficiencyRatingWattHours,
} from '../../utils';

class SessionScreen extends Component {
  render() {
    const onResetClick = _.get(this, 'props.onResetClick', () => {});
    const {wh, peakWatts, time} = this.props;
    const img = efficiencyImgWattHours(wh);
    return (
      <div className="session-end">
        <div className="row">
          <div className="col session-summary">
            <div className="row">
              <div className="col">Energy Created</div>
              <div className="col">{renderWh(wh)} Wh</div>
            </div>
            <div className="row">
              <div className="col">Time</div>
              <div className="col">{renderMinSec(time)}</div>
            </div>
            <div className="row">
              <div className="col">Peak Watts</div>
              <div className="col">{renderWatts(peakWatts)} W</div>
            </div>
            <div className="row">
              <div className="col">Efficiency Rating</div>
              <div className="col">{efficiencyRatingWattHours(wh)}</div>
            </div>
          </div>
        </div>
        <div className="row session-efficiency-comparison">
          <div className="block-center">
            <img src={img} alt="Efficiency Image" style={{ width: '150px', margin: '25px' }} />
          </div>
        </div>
        <div className="row">
          <ResetButton onClick={onResetClick} />
        </div>
      </div>
    );
  }
}

export default SessionScreen;
