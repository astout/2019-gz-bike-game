import React, { Component } from 'react';
import _ from 'lodash';

function getCountTxt(count) {
  return count > 0 ? count : 'Go!';
}

class SessionCountDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 3,
      interval: null,
    };

    this.onTick = this.onTick.bind(this);
  }

  componentDidMount() {
    clearInterval(this.state.interval);
    this.setState({
      interval: setInterval(this.onTick, 1000),
    });
  }

  onTick() {
    let { count } = this.state;
    if (count <= 0) {
      _.invoke(this, 'props.onFinish');
    }
    count = count > 0 ? count - 1 : 0;
    console.log('tick', count);
    this.setState({
      count,
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  render() {
    const text = getCountTxt(this.state.count);
    return (
      <h1 className="countdown text-center">{text}</h1>
    );
  }
}

export default SessionCountDown;
