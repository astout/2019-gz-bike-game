import React from 'react';
import { render } from 'react-dom';
import './views/css/styles.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';

// Views
import { App, Header } from './views/Components/index';
import { Home } from './views/Containers/index';

render(
  <div>
    <Header />
    <Router>
      <App>
        <Route exact path='/' component={Home} />
        <Route exact path='/admin' component={Home} />
      </App>
    </Router>
  </div>, document.getElementById('root'));

serviceWorker.register(); // eslint-disable-line no-undef
