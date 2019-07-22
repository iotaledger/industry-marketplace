import { Component } from 'react';
import { ServiceFactory } from '../../factories/serviceFactory';

class ZmqView extends Component {
    constructor(props) {
        super(props);

        this._subscriptions = [];
        this._apiClient = ServiceFactory.get('api');

        this.state = {
            isRunning: false,
        };

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
        return null;
    }

    /**
     * Start the subscription running.
     */
    async start() {
        this.setState({ isRunning: true }, async () => {
            const response = await this._apiClient.zmqSubscribe({ events: ['tx'] }, (_, data) => {
                this.props.callback({ ...data });
            });

            this._subscriptions = [];
            if (response.subscriptionIds) {
                this._subscriptions.push({ event: 'tx', subscriptionId: response.subscriptionIds[0] });
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
