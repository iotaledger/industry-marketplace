import { decode } from '@iota/area-codes';
import uuid from 'uuid/v4';
import zmq from 'zeromq';
import { maxDistance, operations } from '../config.json';
import { readData } from '../utils/databaseHelper';
import { convertOperationsList, extractMessageType } from '../utils/eclassHelper';
import { getPayload } from '../utils/iotaHelper';
import { calculateDistance, getLocationFromMessage } from '../utils/locationHelper';

/**
 * Class to handle ZMQ service.
 */
export class ZmqService {

    /**
     * Bundlehashes that were already send to not send twice 
     *
     */  
    public sentBundles = [];
    /**
     * The configuration for the service.
     */
    private readonly _config;

    /**
     * The connected socket.
     */
    private _socket;

    /**
     * The callback for different events.
     */
    private readonly _subscriptions;

    /**
     * Create a new instance of ZmqService.
     * @param config The gateway for the zmq service.
     */
    constructor(config) {
        this._config = config;
        this._subscriptions = {};
    }

    /**
     * Subscribe to named event.
     * @param event The event to subscribe to.
     * @param callback The callback to call with data for the event.
     * @returns An id to use for unsubscribe.
     */
    public subscribe(event, callback) {
        return this.internalAddEventCallback(event, callback);
    }

    /**
     * Subscribe to a specific event.
     * @param event The event to subscribe to.
     * @param callback The callback to call with data for the event.
     * @returns An id to use for unsubscribe.
     */
    public subscribeEvent(event, callback) {
        return this.internalAddEventCallback(event, callback);
    }

    /**
     * Unsubscribe from an event.
     * @param subscriptionId The id to unsubscribe.
     */
    public unsubscribe(subscriptionId) {
        const keys = Object.keys(this._subscriptions);
        for (let i = 0; i < keys.length; i++) {
            const eventKey = keys[i];
            for (let j = 0; j < this._subscriptions[eventKey].length; j++) {
                if (this._subscriptions[eventKey][j].id === subscriptionId) {
                    this._subscriptions[eventKey].splice(j, 1);
                    if (this._subscriptions[eventKey].length === 0) {
                        this._socket.unsubscribe(eventKey);

                        delete this._subscriptions[eventKey];

                        if (Object.keys(this._subscriptions).length === 0) {
                            this.disconnect();
                        }
                    }
                    return;
                }
            }
        }
    }

    /**
     * Connect the ZMQ service.
     */
    private connect() {
        try {
            if (!this._socket) {
                this._socket = zmq.socket('sub');
                this._socket.connect(this._config.endpoint);

                this._socket.on('message', (msg) => this.handleMessage(msg));

                const keys = Object.keys(this._subscriptions);
                for (let i = 0; i < keys.length; i++) {
                    this._socket.subscribe(keys[i]);
                }
            }
        } catch (err) {
            throw new Error(`Unable to connect to ZMQ.\n${err}`);
        }
    }

    /**
     * Disconnect the ZQM service.
     */
    private disconnect() {
        if (this._socket) {
            this._socket.close();
            this._socket = undefined;
        }
    }

    /**
     * Add a callback for the event.
     * @param event The event to add the callback for.
     * @param callback The callback to store for the event.
     * @returns The id of the subscription.
     */
    private internalAddEventCallback(event, callback) {
        if (!this._subscriptions[event]) {
            this._subscriptions[event] = [];
            if (this._socket) {
                this._socket.subscribe(event);
            }
        }
        const id = uuid();
        this._subscriptions[event].push({ id, callback });

        this.connect();

        return id;
    }

    /**
     * Build payload for the socket packet
     */
    private buildPayload(data, messageType, messageParams) {
        return {
            data,
            messageType,
            tag: messageParams[12],
            hash: messageParams[1],
            address: messageParams[2],
            timestamp: parseInt(messageParams[5], 10)
        };
    }

    /**
     * Send out an event
     */
    private sendEvent(data, messageType, messageParams) {
        const event = messageParams[0];
        const payload = this.buildPayload(data, messageType, messageParams);
        
        for (let i = 0; i < this._subscriptions[event].length; i++) {
            this._subscriptions[event][i].callback(event, payload);
        }
    }

    /**
     * Handle a message and send to any callbacks.
     * @param message The message to handle.
     */
    private async handleMessage(message) {

        const messageContent = message.toString();
        const messageParams = messageContent.split(' ');

        const event = messageParams[0];
        const tag = messageParams[12];

        const operationList = await convertOperationsList(operations);

        if (event === 'tx' && this._subscriptions[event]) {
            const messageType = extractMessageType(tag);
            
            if (tag.startsWith(this._config.prefix) && messageType && operationList.includes(tag.slice(9,15)) == true) {
                const bundle = messageParams[8];

                if (this.sentBundles.includes(bundle)) {
                    this.sentBundles = [];
                } else {
                    this.sentBundles.push(bundle);

                    const data = await getPayload(bundle);
                    this.sendEvent(data, messageType, messageParams);

                    interface IUser {
                        id?: string;
                        role?: string;
                        areaCode?: string;
                    }
                    const { id, role, areaCode }: IUser = await readData('user');

                    // 1. Check user role (SR, SP, YP)
                    switch (role) {
                        case 'SR':
                            // 2. For SR only react on message types B, E ('proposal' and 'informConfirm')
                            if (['proposal', 'informConfirm'].includes(messageType)) {
                                // 2.1 Decode every such message and retrieve receiver ID
                                const data = await getPayload(bundle);
                                const receiverID = data.frame.receiver.identification.id;

                                // 2.2 Compare receiver ID with user ID. Only if match, send message to UI
                                if (id === receiverID) {
                                    this.sendEvent(data, messageType, messageParams);
                                }
                            }
                            break;
                        case 'SP':
                            // 3. For SP only react on message types A, C, D, F ('callForProposal', 'acceptProposal', 'rejectProposal', and 'informPayment')
                            if (['callForProposal', 'acceptProposal', 'rejectProposal', 'informPayment'].includes(messageType)) {
                                const data = await getPayload(bundle);

                                // 3.1 Decode every message of type A, retrieve location.
                                if (messageType === 'callForProposal') {
                                    const location = await getLocationFromMessage(data);

                                    // 3.2 If NO own location and NO accepted range are set, send message to UI
                                    if (!areaCode || !maxDistance) {
                                        this.sendEvent(data, messageType, messageParams);
                                    }

                                    // 3.3 If own location and accepted range are set, calculate distance between own location and location of the request.
                                    if (areaCode && maxDistance) {

                                        try {
                                            const ownLocObj = await decode(areaCode)
                                            const locObj = await decode(location)
                                            const distance = await calculateDistance(ownLocObj, locObj)

                                            // 3.3.1 If distance within accepted range, send message to UI
                                            if (distance <= maxDistance) {
                                                this.sendEvent(data, messageType, messageParams);
                                            }
                                        } catch (error) {
                                            console.error(error)
                                        }
                                    }
                                } else {
                                    // 3.4 Decode every message of type C, D, F and retrieve receiver ID
                                    const receiverID = data.frame.receiver.identification.id;

                                    // 3.5 Compare receiver ID with user ID. Only if match, send message to UI
                                    if (id === receiverID) {
                                        this.sendEvent(data, messageType, messageParams);
                                    }
                                }
                            }
                            break;
                        case 'YP':
                        default:
                            // 4. For YP only react on message types A, B, C ('callForProposal', 'proposal' and 'acceptProposal')
                            if (['callForProposal', 'proposal', 'acceptProposal'].includes(messageType)) {
                                const data = await getPayload(bundle);
                                // 4.1 Send every such message to UI
                                this.sendEvent(data, messageType, messageParams);
                            }
                    }
                }
            }
        }
    }
}