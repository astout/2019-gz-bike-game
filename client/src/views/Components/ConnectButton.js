import React, { Component } from 'react';
import { Connection } from '../../constants';

const Text = {
  disconnected: 'Disconnected',
  connected: 'Start',
  searching: 'Searching',
};

class ConnectButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: Text.disconnected,
    };
  }

  render() {
    let { status, onClick } = this.props;
    let { text } = this.state;

    if (status === Connection.searching) {
      switch (text) {
        case `${Text.searching}`:
          text = `${Text.searching}.`;
          break;
        case `${Text.searching}.`:
          text = `${Text.searching}..`;
          break;
        case `${Text.searching}..`:
          text = `${Text.searching}...`;
          break;
        default:
          text = Text.searching;
          break;
      }
    } else {
      text = Text[status];
    }

    const params = {
      style: status === Connection.connected ? { width: '450px' } : {},
      disabled: (status !== Connection.connected),
      onClick,
    };

    return (
      <button className="btn btn-gzgreen btn-big block-center" {...params} >
        {text}
      </button>
    );
  }
}

export default ConnectButton;
