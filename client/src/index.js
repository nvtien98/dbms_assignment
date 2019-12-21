import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { store } from './_utils/store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';

import './index.css';

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root'));
serviceWorker.unregister();
