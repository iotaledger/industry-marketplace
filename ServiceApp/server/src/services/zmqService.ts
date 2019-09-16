import uuid from 'uuid/v4';
import zmq from 'zeromq';
import { maxDistance, operations, provider } from '../config.json';
import { readData, writeData } from '../utils/databaseHelper';
import { convertOperationsList, extractMessageType } from '../utils/eclassHelper';
import { decryptWithReceiversPrivateKey } from '../utils/encryptionHelper';
import { getPayload } from '../utils/iotaHelper';
import { calculateDistance, getLocationFromMessage } from '../utils/locationHelper';
import { publish } from '../utils/mamHelper';
import { processPayment } from '../utils/walletHelper';
import { VerificationErrorCodes, VerifyDIDAuthentication, DID } from 'identity_ts';
import { ProcessReceivedCredentialForUser } from '../utils/credentialHelper.js';
import { SchemaHelper } from '../utils/schemaHelper.js';

/**
 * Class to handle ZMQ service.
 */
export class ZmqService {

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
    private listenAddress : string | undefined;

    /**
     * Create a new instance of ZmqService.
     * @param config The gateway for the zmq service.
     */
    constructor(config) {
        this._config = config;
        this._subscriptions = {};
        this._bundleInterval = setInterval(this.emptyBundleArray.bind(this), 10000);
        this._paymentInterval = setInterval(this.processPayments.bind(this), 5 * 60 * 1000);
        this.listenAddress = undefined;

        //Add trusted identities (Initially, the DID of the IOTA Foundation)
        const schema = SchemaHelper.GetInstance().GetSchema("WhiteListedCredential");
        for(let i=0; i < this._config.trustedIdentities.length; i++) {
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

    public setAddressToListenTo(address : string | undefined) {
        this.listenAddress = address;
        console.log("Set listen address: " + address);
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
    private async sendEvent(data, messageType, messageParams) {
        const event = messageParams[0];
        const payload = this.buildPayload(data, messageType, messageParams);
        console.log(`Sending ${messageType}`);

        //Locally store the challenge received
        if(['callForProposal', 'proposal'].includes(messageType)) {
            await writeData('incomingChallenge', {id:data.frame.conversationId, challenge:data.identification.authenticationChallenge});
        }

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
        const address = messageParams[2];
        const tag = messageParams[12];

        const operationList = await convertOperationsList(operations);

        if (event === 'tx' && this._subscriptions[event]) {
            console.log(tag);
            const messageType = extractMessageType(tag);
            
            if (tag.startsWith(this._config.prefix) && messageType && operationList.includes(tag.slice(9, 15))) {
                const bundle = messageParams[8];

                if (!this.sentBundles.includes(bundle)) {
                    this.sentBundles.push(bundle);

                    interface IUser {
                        id?: string;
                        name?: string;
                        role?: string;
                        location?: string;
                        address ?: string;
                    }
                    const { id, role, location }: IUser = await readData('user');

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
                                    if(messageType == 'proposal') {
                                        //Find the challenge
                                        const outgoingChallenge : any = await readData('outgoingChallenge', data.frame.conversationId);

                                        //Verify Identity challange completion before sending events
                                        let errorCode : VerificationErrorCodes = await VerifyDIDAuthentication(data.identification.didAuthenticationPresentation, provider);
                                        //Check if the correct challenge is used and if the signatures are correct
                                        if(errorCode == VerificationErrorCodes.SUCCES && data.identification.didAuthenticationPresentation.proof.nonce == outgoingChallenge.challenge) {
                                            //Only send to UI if the DID Authentication is succesful
                                            await this.sendEvent(data, messageType, messageParams);

                                            if (messageType === 'informConfirm') {
                                                const channelId = data.frame.conversationId;
                                                await publish(channelId, data);
                                            }
                                        } else {
                                            console.log('DIDAuthenticationError', errorCode);
                                            console.log('SolvedChallenge', data.identification.didAuthenticationPresentation.proof.nonce);
                                            console.log('RequestedChallenge', outgoingChallenge.challenge);
                                        }
                                    } else {
                                        await this.sendEvent(data, messageType, messageParams);
                                        const channelId = data.frame.conversationId;
                                        await publish(channelId, data);
                                    }
                                }
                            }
                            break;
                        case 'SP':
                            // 3. For SP only react on message types A, C, D, F ('callForProposal', 'acceptProposal', 'rejectProposal', and 'informPayment')
                            if (['callForProposal', 'acceptProposal', 'rejectProposal', 'informPayment'].includes(messageType)) {
                                const data = await getPayload(bundle);

                                // 3.1 Decode every message of type A, retrieve location.
                                if (messageType === 'callForProposal') {
                                    const senderLocation = await getLocationFromMessage(data);

                                    // 3.2 If NO own location and NO accepted range are set, send message to UI
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
                                            const outgoingChallenge : any = await readData('outgoingChallenge', channelId);

                                            //Verify Identity challange completion before sending events
                                            let errorCode : VerificationErrorCodes = await VerifyDIDAuthentication(data.identification.didAuthenticationPresentation, provider);
                                            //Check if the correct challenge is used and if the signatures are correct
                                            if(errorCode == VerificationErrorCodes.SUCCES && data.identification.didAuthenticationPresentation.proof.nonce == outgoingChallenge.challenge) {
                                                const secretKey = await decryptWithReceiversPrivateKey(data.mam);
                                                await writeData('mam', { 
                                                    id: channelId, 
                                                    root: data.mam.root, 
                                                    seed: '', 
                                                    next_root: '', 
                                                    side_key: secretKey, 
                                                    start: 0 
                                                });
                                                await this.sendEvent(data, messageType, messageParams);
                                            } else {
                                                console.log('DIDAuthenticationError', errorCode);
                                                console.log('SolvedChallenge', data.identification.didAuthenticationPresentation.proof.nonce);
                                                console.log('RequestedChallenge', outgoingChallenge.challenge);
                                            }
                                        } else {
                                            await this.sendEvent(data, messageType, messageParams);
                                        }
                                    }
                                }
                            }
                            break;
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
            else if(this.listenAddress && address == this.listenAddress) {
                const bundle = messageParams[8];
                if (!this.sentBundles.includes(bundle)) {
                    this.sentBundles.push(bundle);

                    //A message has been received through the ServiceEndpoint of the DID
                    const unstructuredData = await getPayload(bundle);
                    ProcessReceivedCredentialForUser(unstructuredData, provider);
                }
            }
        }
    }
}
