import 'iota-css-theme';
import { Footer, GoogleAnalytics, Header, LayoutAppSingle, StatusMessage } from 'iota-react-components';
import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import logo from '../assets/logo.svg';
import contentHomePage from '../content/contentHomePage.json';
import { ServiceFactory } from '../factories/serviceFactory';
import { ApiClient } from '../services/apiClient';
import ZmqView from './components/ZmqView';
import config from '../config.json';

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
            ServiceFactory.register('api', () => new ApiClient(config.apiEndpoint));

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
            <React.Fragment>
                <Header title='IOTA ZMQ' topLinks={contentHomePage.headerTopLinks} logo={logo} compact={true} />
                <section className='content'>
                    <LayoutAppSingle>
                        <StatusMessage status={this.state.status} color={this.state.statusColor} isBusy={this.state.isBusy} />
                        {!this.state.status && (
                            <Switch>
                                <Route exact={true} path='/' component={() => (<ZmqView hash={Date.now()} />)} />
                            </Switch>
                        )}
                    </LayoutAppSingle>
                </section>
                <Footer history={this.props.history} sections={contentHomePage.footerSections} staticContent={contentHomePage.footerStaticContent} />
                <GoogleAnalytics id={this._configuration && this._configuration.googleAnalyticsId} />
            </React.Fragment>
        );
    }
}

export default withRouter(App);
