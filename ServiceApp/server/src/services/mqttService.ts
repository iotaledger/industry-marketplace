import { ClientBuilder } from '@iota/client';
import { DID, SchemaManager } from 'identity_ts';
import { v4 as uuid } from 'uuid';
import { maxDistance, operations, provider, security } from '../config.json';
import { processReceivedCredentialForUser, VERIFICATION_LEVEL } from '../utils/credentialHelper';
import { readData, writeData } from '../utils/databaseHelper';
import { convertOperationsList, extractMessageType } from '../utils/eclassHelper';
import { decryptWithReceiversPrivateKey } from '../utils/encryptionHelper';
import { calculateDistance, getLocationFromMessage } from '../utils/locationHelper';
import { publish } from '../utils/mamHelper';
import { processPayment } from '../utils/walletHelper';

const client = new ClientBuilder()
  .node(provider)
//   .brokerOptions({ useWs: false })
  .build();

/**
 * Class to handle MQTT service.
 */
export class MqttService {

    /**
     * Bundle hashes that were already send to not send twice
     *
     */
    public sentBundles = [];

    /**
     * The interval to frequently delete sentBundle array.
     */
    public _bundleInterval;

    /**
     * The interval to frequently delete sentBundle array.
     */
    public _paymentInterval;

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
     *
     */
    private listenAddress: string | undefined;

    /**
     * Create a new instance of MqttService.
     * @param config The gateway for the mqtt service.
     */
    constructor(config) {
        this._config = config;
        this._subscriptions = {};
        this._bundleInterval = setInterval(this.emptyBundleArray.bind(this), 10000);
        this._paymentInterval = setInterval(this.processPayments.bind(this), 5 * 60 * 1000);
        this.listenAddress = null;

        // Add trusted identities (Initially, the DID of the IOTA Foundation)
        const schema = SchemaManager.GetInstance().GetSchema('WhiteListedCredential');
        for (let i = 0; i < this._config.trustedIdentities.length; i++) {
            schema.AddTrustedDID(new DID(this._config.trustedIdentities[i]));
        }
    }

    /**
     * Clear sentBundles array
     */
    public emptyBundleArray() {
        this.sentBundles = [];
    }

    public processPayments() {
        processPayment();
    }

    public setAddressToListenTo(address: string | undefined) {
        this.listenAddress = address;
        console.log('Set listen address: ', address);
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
     * Connect the MQTT service.
     */
    private connect() {
        client.subscriber().topics(['messages']).subscribe(async (err, msg) => {
            try {
                if (err) {
                    console.log(err);
                }
                this.handleMessage(msg);
                // const keys = Object.keys(this._subscriptions);
                // for (let i = 0; i < keys.length; i++) {
                //     this._socket.subscribe(keys[i]);
                // }
            } catch (err) {
                throw new Error(`Unable to connect to MQTT.\n${err}`);
            }
         });
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

        console.log('internalAddEventCallback');
        this.connect();

        return id;
    }

    /**
     * Build payload for the socket packet
     */
    private buildPayload(data, messageType, messageParams, trustLevel) {
        return {
            data,
            messageType,
            tag: messageParams[12],
            hash: messageParams[1],
            address: messageParams[2],
            timestamp: parseInt(messageParams[5], 10),
            trustLevel
        };
    }

    /**
     * Send out an event
     */
    private async sendEvent(data, messageType, messageParams, trustLevel: VERIFICATION_LEVEL = VERIFICATION_LEVEL.DID_TRUSTED) {
        const event = messageParams[0];
        const payload = this.buildPayload(data, messageType, messageParams, trustLevel);

        console.log(`Sending ${messageType}`);

        for (let i = 0; i < this._subscriptions[event].length; i++) {
            this._subscriptions[event][i].callback(event, payload);
        }
    }

    /**
     * Handle a message and send to any callbacks.
     * @param message The message to handle.
     */
    private async handleMessage(message) {

        const messageData = JSON.parse(message.payload);
        let data;
        let tag;
        try {
          data = (Buffer.from(messageData.payload.data.data)).toString();
          tag = (Buffer.from(messageData.payload.data.index)).toString();
        } catch {}

        const messageContent = message.toString();
        const messageParams = messageContent.split(' ');

        const address = messageParams[2];
        const operationList = await convertOperationsList(operations);

        // tslint:disable-next-line:no-string-literal
        if (this._subscriptions['tx']) {
            const messageType = extractMessageType(tag);

            // tslint:disable-next-line:no-unused-expression
            messageType && console.log('handleMessage', messageType, tag);

            if (tag.startsWith(this._config.prefix) && messageType && operationList.includes(tag.slice(9, 15))) {
                    interface IUser {
                        id?: string;
                        name?: string;
                        role?: string;
                        location?: string;
                        address?: string;
                    }
                    const { id, role, location }: IUser = await readData('user');

                    // 1. Check user role (SR, SP, YP)
                    switch (role) {
                        case 'SR':
                            // 2. For SR only react on message types B, E ('proposal' and 'informConfirm')
                            if (['proposal', 'informConfirm'].includes(messageType)) {
                                // 2.1 Decode every such message and retrieve receiver ID
                                const receiverID = data.frame.receiver.identification.id;

                                // 2.2 Compare receiver ID with user ID. Only if match, send message to UI
                                if (id === receiverID) {
                                    await this.sendEvent(data, messageType, messageParams);

                                    if (messageType !== 'proposal') {
                                        const channelId = data.frame.conversationId;
                                        await publish(channelId, data);
                                    }
                                }
                            }
                            break;
                        case 'SP':
                            // 3. For SP only react on message types A, C, D, F ('callForProposal', 'acceptProposal', 'rejectProposal', and 'informPayment')
                            if (['callForProposal', 'acceptProposal', 'rejectProposal', 'informPayment'].includes(messageType)) {
                                // 3.1 Decode every message of type A, retrieve location.
                                if (messageType === 'callForProposal') {
                                    const senderLocation = await getLocationFromMessage(data);

                                    if (!location || !maxDistance) {
                                        await this.sendEvent(data, messageType, messageParams);
                                    }

                                    // 3.3 If own location and accepted range are set, calculate distance between own location and location of the request.
                                    if (location && maxDistance) {
                                        try {
                                            const distance = await calculateDistance(location, senderLocation);

                                            // 3.3.1 If distance within accepted range, send message to UI
                                            if (distance <= maxDistance) {
                                                await this.sendEvent(data, messageType, messageParams);
                                            }
                                        } catch (error) {
                                            console.error(error);
                                        }
                                    }
  
                                } else {
                                    // 3.4 Decode every message of type C, D, F and retrieve receiver ID
                                    const receiverID = data.frame.receiver.identification.id;

                                    // 3.5 Compare receiver ID with user ID. Only if match, send message to UI
                                    if (id === receiverID) {
                                        if (messageType === 'acceptProposal') {
                                            const channelId = data.frame.conversationId;

                                            // Check if the correct challenge is used and if the signatures are correct
                                            const secretKey = await decryptWithReceiversPrivateKey(data.mam);
                                            await writeData('mam', {
                                                id: channelId,
                                                root: data.mam.root,
                                                seed: '',
                                                nextRoot: '',
                                                sideKey: secretKey,
                                                start: 0,
                                                mode: '',
                                                security,
                                                count: 1,
                                                nextCount: 1,
                                                index: 0
                                            });
                                        }
                                        await this.sendEvent(data, messageType, messageParams);
                                    }
                                }
                            }
                            break;
                        default:
                            // 4. For YP only react on message types A, B, C ('callForProposal', 'proposal' and 'acceptProposal')
                            if (['callForProposal', 'proposal', 'acceptProposal'].includes(messageType)) {
                                // 4.1 Send every such message to UI
                                this.sendEvent(data, messageType, messageParams);
                            }
                    }
            } else if (this.listenAddress && address === this.listenAddress) {
                // A message has been received through the ServiceEndpoint of the DID
                processReceivedCredentialForUser(data);
            }
        }
    }
}
