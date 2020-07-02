import React, { Component } from 'react';
import axios from 'axios';
import { FailMode, LinearWalkStrategy, SuccessMode } from '@iota/client-load-balancer';
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

            let settings = config;

            if (config.onlineNodeConfig) {
                const response = await axios.get(config.onlineNodeConfigURL);
                const data = response.data;
                if (data) {
                    settings = data;
                }
            }

            const loadBalancerSettings = {
                nodeWalkStrategy: new LinearWalkStrategy(
                    settings.providers.map(provider => ({ provider }))
                ),
                depth: settings.depth,
                mwm: settings.minWeightMagnitude,
                successMode: SuccessMode.keep,
                failMode: FailMode.all,
                timeoutMs: 10000,
                failNodeCallback: (node, err) => {
                    console.log(`Failed node ${node.provider}, ${err.message}`);
                }
            };
            ServiceFactory.register('load-balancer-settings', () => loadBalancerSettings);

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
