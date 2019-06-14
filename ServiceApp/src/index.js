import React from 'react';
import ReactDOM from 'react-dom';
import WebFontLoader from 'webfontloader';
import { HashRouter, Switch, Route } from 'react-router-dom';
import './assets/scss/index.scss';
import DashboardPage from './pages/dashboard';

WebFontLoader.load({
  google: {
    families: ['Nunito Sans:300,400,600,700', 'Material Icons'],
  },
});

const renderApp = () => (
  <HashRouter>
    <Switch>
      <Route path="/" component={DashboardPage} exact />
      <Route component={DashboardPage} />
    </Switch>
  </HashRouter>
);

ReactDOM.render(renderApp(), document.getElementById('root'));
