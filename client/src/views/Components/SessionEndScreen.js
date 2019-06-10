import React, { Component } from 'react';
import ResetButton from './ResetButton';
import _ from 'lodash';
import { renderWh, renderMinSec, renderWatts } from '../../utils';

class SessionScreen extends Component {
  render() {
    const onResetClick = _.get(this, 'props.onResetClick', () => {});
    const {wh, peakWatts, time} = this.props;
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
            {/* <div className="row">
              <div className="col">Session Code</div>
              <div className="col">AAAAAA</div>
            </div> */}
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
