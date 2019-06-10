import React, { Component } from 'react';
import _ from 'lodash';

class ResetButton extends Component {
  render() {
    const onClick = _.get(this, 'props.onClick', () => {});
    return (
      <button className="btn btn-gzgreen btn-pretty-big block-center" onClick={onClick}>Reset</button>
    );
  }
}

export default ResetButton;
