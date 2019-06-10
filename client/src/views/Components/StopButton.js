import React, { Component } from 'react';

class StopButton extends Component {
  render() {
    const { onClick } = this.props;
    return (
      <button className="btn btn-gzgreen btn-pretty-big block-center" onClick={onClick}>Stop</button>
    );
  }
}

export default StopButton;
