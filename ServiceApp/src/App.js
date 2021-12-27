import React, { Component } from 'react';
import { SingleNodeClient } from '@iota/iota.js';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ServiceFactory } from './factories/serviceFactory';
import { ApiClient } from './services/apiClient';
import GlobalState from './context/globalState';
import DashboardPage from './pages/dashboard';
import DetailsPage from './pages/details';
import config from './config.json';

class App extends Component {
    constructor(props) {
        super(props);
        this._configuration = {};

        this.state = {
            isBusy: true,
            status: 'Loading Configuration...',
            statusColor: 'info'
        };
    }

    async componentDidMount() {
        try {
            ServiceFactory.register('api', () => new ApiClient(config.domain));

            const node = new SingleNodeClient(config.providersC2[0]);
            ServiceFactory.register('node', () => node );

            this._configuration = config;

            this.setState({
                isBusy: false,
                status: '',
                statusColor: 'success'
            });
        } catch (err) {
            this.setState({
                isBusy: false,
                status: err.message,
                statusColor: 'danger'
            });
        }
    }

    render() {
        return (
            <GlobalState>
                <BrowserRouter>
                    {!this.state.status && (
                        <Switch>
                            <Route path="/" component={DashboardPage} exact />
                            <Route path="/conversation/:conversationId" component={DetailsPage} />
                            <Route component={DashboardPage} />
                        </Switch>
                    )}
                </BrowserRouter>
            </GlobalState>
        );
    }
}

export default App;
