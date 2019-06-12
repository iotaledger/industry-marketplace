import SocketIOClient from 'socket.io-client';

/**
 * Class to handle api communications.
 */
export class ApiClient {
    constructor(endpoint) {
        this._endpoint = endpoint; // The endpoint for performing communications.
        this._socket = SocketIOClient(this._endpoint); // The web socket to communicate on.
    }
    
    /**
     * Perform a request to subscribe to zmq events.
     * @param request The request to send.
     * @param callback Callback called with zmq data.
     * @returns The response from the request.
     */
    async zmqSubscribe(request, callback) {
        return new Promise(resolve => {
            try {
                this._socket.emit('subscribe', request);
                this._socket.on('subscribe', subscribeResponse => {
                    resolve(subscribeResponse);
                });
                this._socket.on('zmq', zmqResponse => {
                    callback(zmqResponse.event, zmqResponse.data);
                });
            } catch (err) {
                resolve({
                    success: false,
                    message: `There was a problem communicating with the API.\n${err}`
                });
            }
        });
    }

    /**
     * Perform a request to unsubscribe to zmq events.
     * @param request The request to send.
     * @returns The response from the request.
     */
    async zmqUnsubscribe(request) {
        return new Promise(resolve => {
            try {
                this._socket.emit('unsubscribe', request);
                this._socket.on('unsubscribe', subscribeResponse => {
                    resolve(subscribeResponse);
                });
            } catch (err) {
                resolve({
                    success: false,
                    message: `There was a problem communicating with the API.\n${err}`
                });
            }
        });
    }
}
