// import { Button, ButtonContainer, Form, FormActions } from 'iota-react-components';
import { Heading } from 'iota-react-components';
import React, { Component } from 'react';
import { ServiceFactory } from '../../factories/serviceFactory';
import './ZmqView.scss';

class ZmqView extends Component {
    constructor(props) {
        super(props);

        this._subscriptions = [];
        this._apiClient = ServiceFactory.get('api');

        this.state = {
            allSubscribeEvents: ['tx'],
            subscribeEvents: ['tx'],
            isRunning: false,
            totalEvents: 0,
            events: []
        };

        // this.restart = this.restart.bind(this);
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
    }

    componentDidMount() {
        this.start()
        window.addEventListener('beforeunload', this.stop);
    }

    componentWillUnmount() {
        this.stop();
        window.removeEventListener('beforeunload', this.stop); // remove the event handler for normal unmounting
    }

    render() {
        return (
            <React.Fragment>
                <Heading level={1}>ZMQ Events</Heading>
                {!this.state.isRunning && this.state.totalEvents === 0 && (
                    <p>There are not yet any events to show.</p>
                )}

                {this.state.isRunning && this.state.totalEvents === 0 && (
                    <p>Waiting for first event ...</p>
                )}

                {this.state.totalEvents > 0 && (
                    <p>Showing the last {this.state.events.length} events of {this.state.totalEvents}.</p>
                )}

                {this.state.events.map((e, idx) => (
                    <React.Fragment key={idx}>
                        <div className='zmq-card'>
                            <Heading level={2} className='zmq-card-title'>{e.event}</Heading>
                            <div className='zmq-card-data'>
                                {Object.keys(e.data).map((key, idx2) => (
                                    <div className='zmq-card-data-row' key={idx2}>
                                        <div className='zmq-card-data-row-label'>{key}</div>
                                        <div className='zmq-card-data-row-value'>{e.data[key]}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </React.Fragment>
                ))}
            </React.Fragment>
        );
    }

    /**
     * Start the subscription running.
     */
    async start() {
        this.setState({ isRunning: true }, async () => {
            const response = await this._apiClient.zmqSubscribe(
                {
                    events: this.state.subscribeEvents
                },
                (event, data) => {
                    const events = this.state.events;
                    events.unshift({ event, data });
                    this.setState({ events: events.slice(0, 50), totalEvents: this.state.totalEvents + 1 });
                });

            this._subscriptions = [];

            if (response.subscriptionIds) {
                for (let i = 0; i < this.state.subscribeEvents.length; i++) {
                    this._subscriptions.push({ event: this.state.subscribeEvents[i], subscriptionId: response.subscriptionIds[i] });
                }
            }
        });
    }

    /**
     * Stop the subscription running.
     */
    async stop() {
        this.setState({ isRunning: false }, async () => {
            if (this._subscriptions) {
                await this._apiClient.zmqUnsubscribe(
                    {
                        subscriptionIds: this._subscriptions.map(s => s.subscriptionId)
                    });

                this._subscriptions = [];
            }
        });
    }
}

export default ZmqView;
