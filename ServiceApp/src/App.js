import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ServiceFactory } from './factories/serviceFactory';
import { ApiClient } from './services/apiClient';
import DashboardPage from './pages/dashboard';
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
            <BrowserRouter>
                {!this.state.status && (
                    <Switch>
                        <Route path="/" component={DashboardPage} exact />
                        <Route component={DashboardPage} />
                    </Switch>
                )}
            </BrowserRouter>
        );
    }
}

export default App;
