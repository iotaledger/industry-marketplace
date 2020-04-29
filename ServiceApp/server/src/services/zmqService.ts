import uuid from 'uuid/v4';
import zmq from 'zeromq';
import {  operations } from '../config.json';
import { processReceivedCredentialForUser, VERIFICATION_LEVEL, verifyCredentials } from '../utils/credentialHelper';
import { readData, readRow, writeData, updateValue } from '../utils/databaseHelper';
import { convertOperationsList, extractMessageType } from '../utils/eclassHelper';
import { decryptWithReceiversPrivateKey } from '../utils/encryptionHelper';
import { getPayload } from '../utils/iotaHelper';
import { publish } from '../utils/mamHelper';
import { getBalance, processPayment } from '../utils/walletHelper.js';
import { DID, SchemaManager } from 'identity_ts';



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
     * The interval to frequently delete sentBundle array.
     */
    public _bundleInterval;

    /**
     * The interval to frequently execute payments.
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
    private readonly listenAddress;


    /**
     * Create a new instance of ZmqService.
     * @param config The gateway for the zmq service.
     */
    constructor(config) {
        this._config = config;
        this._subscriptions = {};
        this._bundleInterval = setInterval(this.emptyBundleArray.bind(this), 10000);
        this._paymentInterval = setInterval(this.processPayments.bind(this), 2 * 60 * 1000);
        this.listenAddress = [];

        //Add trusted identities (Initially, the DID of the IOTA Foundation)
        const schema = SchemaManager.GetInstance().GetSchema("WhiteListedCredential");

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
    /**
     * Process payments
     */
    public processPayments() {
        processPayment();
    }

    public setAddressToListenTo(address: string | undefined) {
        this.listenAddress.push(address)
        console.log("Listening to addresses " + this.listenAddress);
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
    private async sendEvent(data, messageType, messageParams, trustLevel: VERIFICATION_LEVEL = VERIFICATION_LEVEL.UNVERIFIED) {
        const event = messageParams[0];
        const payload = this.buildPayload(data, messageType, messageParams, trustLevel);

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
        let address = messageParams[2];
        const tag = messageParams[12];

        const operationList = await convertOperationsList(operations);

        if (event === 'tx' && this._subscriptions[event]) {
            const messageType = extractMessageType(tag);


            if (tag.startsWith(this._config.prefix) && messageType && operationList.includes(tag.slice(9, 15))) {
                const bundle = messageParams[8];


                if (!this.sentBundles.includes(bundle)) {
                    this.sentBundles.push(bundle);
                    interface IRole {
                        role?: string;
                    }
                    const { role }: IRole = await readData('user', null, 'role')

                    // 1. Check user role (SR, SP, YP)
                    switch (role) {
                        case 'SP':
                            // 3. For SP only react on message types A, C, D, F ('callForProposal', 'acceptProposal', 'rejectProposal', and 'informPayment')
                            if (['callForProposal', 'acceptProposal', 'rejectProposal', 'informPayment'].includes(messageType)) {
                                const data = await getPayload(bundle);

                                // 3.1 Decode every message of type A and send du simulator
                                if (messageType === 'callForProposal') {
                                    if (data.identification && data.identification.didAuthenticationPresentation) {
                                        verifyCredentials(data.identification.didAuthenticationPresentation)
                                            .then(async (verificationResult) => {
                                                // 3.2 If NO own location and NO accepted range are set, send message to UI
                                                if (verificationResult > VERIFICATION_LEVEL.UNVERIFIED) {
                                                    await this.sendEvent(data, messageType, messageParams, verificationResult);
                                                }
                                            }).catch((err) => {
                                                console.log('Verification failed, so message is ignored with error: ', err);
                                });
                                    }
                                } else {
                                        // 3.4 Decode every message of type C, D, F and retrieve receiver I
                                        const receiverID = data.frame.receiver.identification.id;
                                        
                                        const id : any = await readRow('user', 'id', receiverID)
                                        if (id) {
                                            if (messageType === 'acceptProposal') {
                                                const channelId = data.frame.conversationId;
                                                const id = data.frame.receiver.identification.id

                                                const secretKey = await decryptWithReceiversPrivateKey(data.mam, id);
                                                await writeData('mam', {
                                                    id: channelId,
                                                    root: data.mam.root,
                                                    seed: '',
                                                    next_root: '',
                                                    side_key: secretKey,
                                                    start: 0
                                                });
                                                await this.sendEvent(data, messageType, messageParams);
                                            }
                                            if (messageType === 'informPayment') {
                                                const address = data.walletAddress;
                                                const balance = await getBalance(address)
                                                await updateValue('wallet', 'address', 'balance', address, balance)
                                                this.sendEvent(data, messageType, messageParams);
                                            }
                                            if (messageType === 'rejectProposal') {
                                                this.sendEvent(data, messageType, messageParams);
                                            }

                                        }
                                    }
                            
                            }
                            break;
                            case 'SR':
                            // 2. For SR only react on message types B, E ('proposal' and 'informConfirm')
                            if (['proposal', 'informConfirm'].includes(messageType)) {
                                const data = await getPayload(bundle);
                                const receiverID = data.frame.receiver.identification.id;
                                const simulationUser = await readRow('user', 'id', receiverID)

                                if (simulationUser) {

                                    if (messageType === 'proposal') {

                                        if (data.identification && data.identification.didAuthenticationPresentation) {
                                            verifyCredentials(data.identification.didAuthenticationPresentation)
                                                .then(async (verificationResult) => {
                                                    // Check if the correct challenge is used and if the signatures are correct
                                                    if (verificationResult > VERIFICATION_LEVEL.UNVERIFIED) {
                                                        // Only send to UI if the DID Authentication is succesful
                                                        await this.sendEvent(data, messageType, messageParams, verificationResult);
                                                    }
                                                }).catch((err) => {
                                                    console.log('Verification failed, so message is ignored with error: ', err);
                                                });
                                        }
                                    }
                                        if (messageType === 'informConfirm') {
                                            const channelId = data.frame.conversationId;
                                            await publish(channelId, data);
                                            await this.sendEvent(data, messageType, messageParams);
                                        }
                                    
                                }
                            }
                    }

                }

            } else if (this.listenAddress.includes(address)) {
                const bundle = messageParams[8];
                if (!this.sentBundles.includes(bundle)) {
                    this.sentBundles.push(bundle);
        
                    //A message has been received through the ServiceEndpoint of the DID
                    const unstructuredData = await getPayload(bundle);
                    processReceivedCredentialForUser(unstructuredData);

                }
            }
        }

    }
}