"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const v4_1 = __importDefault(require("uuid/v4"));
const zeromq_1 = __importDefault(require("zeromq"));
const eclassHelper_1 = require("../utils/eclassHelper");
const trytesHelper_1 = require("../utils/trytesHelper");
const iotaHelper_1 = require("../utils/iotaHelper");
/**
 * Class to handle ZMQ service.
 */
class ZmqService {
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
    subscribe(event, callback) {
        return this.internalAddEventCallback(event, callback);
    }
    /**
     * Subscribe to a specific event.
     * @param event The event to subscribe to.
     * @param callback The callback to call with data for the event.
     * @returns An id to use for unsubscribe.
     */
    subscribeEvent(event, callback) {
        return this.internalAddEventCallback(event, callback);
    }
    /**
     * Unsubscribe from an event.
     * @param subscriptionId The id to unsubscribe.
     */
    unsubscribe(subscriptionId) {
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
    connect() {
        try {
            if (!this._socket) {
                this._socket = zeromq_1.default.socket('sub');
                this._socket.connect(this._config.endpoint);
                this._socket.on('message', (msg) => this.handleMessage(msg));
                const keys = Object.keys(this._subscriptions);
                for (let i = 0; i < keys.length; i++) {
                    this._socket.subscribe(keys[i]);
                }
            }
        }
        catch (err) {
            throw new Error(`Unable to connect to ZMQ.\n${err}`);
        }
    }
    /**
     * Disconnect the ZQM service.
     */
    disconnect() {
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
    internalAddEventCallback(event, callback) {
        if (!this._subscriptions[event]) {
            this._subscriptions[event] = [];
            if (this._socket) {
                this._socket.subscribe(event);
            }
        }
        const id = v4_1.default();
        this._subscriptions[event].push({ id, callback });
        this.connect();
        return id;
    }
    /**
     * Handle a message and send to any callbacks.
     * @param message The message to handle.
     */
    async handleMessage(message) {
        const messageContent = message.toString();
        const messageParams = messageContent.split(' ');
        const event = messageParams[0];
        const tag = messageParams[12];
        if (event === 'tx' && this._subscriptions[event]) {
            const messageType = eclassHelper_1.EClassHelper.extractMessageType(tag);
            if (tag.startsWith(this._config.prefix) && messageType) {
                const bundle = messageParams[8];
                const transactions = await iotaHelper_1.IotaHelper.findTransactions(bundle);
                if (!transactions.length || !transactions[0].signatureMessageFragment) {
                    return null;
                }
                const trytes = transactions[0].signatureMessageFragment;
                const data = trytesHelper_1.TrytesHelper.fromTrytes(trytes);
                const payload = {
                    tag,
                    data,
                    messageType,
                    hash: messageParams[1],
                    address: messageParams[2],
                    timestamp: parseInt(messageParams[5], 10)
                };
                this._subscriptions[event][0].callback(event, payload);
            }
        }
    }
}
exports.ZmqService = ZmqService;
