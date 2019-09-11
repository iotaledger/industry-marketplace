import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import App from './App';
import { googleAnalyticsId } from './config.json';
import './assets/styles/index.scss'

ReactGA.initialize(googleAnalyticsId);
ReactGA.set({ anonymizeIp: true });

ReactDOM.render(<App />, document.getElementById('root'));
