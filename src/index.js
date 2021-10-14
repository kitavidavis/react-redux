import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import App from 'components/App';
import * as serviceWorker from './serviceWorker';
import store from 'store'
import { HashRouter } from 'react-router-dom'

import './index.scss';

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();
