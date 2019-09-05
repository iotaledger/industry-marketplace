import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import WebFontLoader from 'webfontloader';
import App from './App';
import { googleAnalyticsId } from './config.json';
import './assets/styles/index.scss'

WebFontLoader.load({
  google: {
    families: ['Nunito Sans:300,400,600,700', 'Material Icons'],
  },
});

ReactGA.initialize(googleAnalyticsId);
ReactGA.set({ anonymizeIp: true });

ReactDOM.render(<App />, document.getElementById('root'));
