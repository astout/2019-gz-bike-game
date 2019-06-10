import React, { Component } from 'react';
import _ from 'lodash';
import TrainerOverview from '../Components/TrainerOverview';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      admin: _.get(props, 'match.url', '').includes('admin'),
    };

    console.log('admin', this.state.admin);
    console.log(props);
  }

  render() {
    return (
      <div className="page container">
        <div className="row">
          <div className="col-md">
            <TrainerOverview />
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
