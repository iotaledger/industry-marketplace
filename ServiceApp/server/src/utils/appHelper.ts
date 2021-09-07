// tslint:disable-next-line:no-require-imports
import { generate } from '@iota/industry_4.0_language';
import axios from 'axios';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import packageJson from '../../package.json';
import config from '../config.json';
import { ServiceFactory } from '../factories/serviceFactory';
import { MqttService } from '../services/mqttService';
import { createAuthenticationPresentationC2, createNewUserC2 } from './credentialHelper';
import identity from '@iota/identity-wasm/node';
import { readData, writeData } from './databaseHelper';
import { encryptWithReceiversPublicKey } from './encryptionHelper';
import { publish } from './mamHelper';
import { createHelperClient, unsubscribeHelperClient, zmqToMQTT } from './mqttHelper';
import { addToPaymentQueue } from './paymentQueueHelper';
import { buildTag } from './tagHelper';
import { sendMessage } from './transactionHelper';
import { fundWallet, generateNewWallet, getBalance } from './walletHelper';

/**
 * Class to help with expressjs routing.
 */
export class AppHelper {
    /**
     * Build the application from the routes and the configuration.
     * @param onComplete Callback called when app is successfully built.
     * @param customListener If true uses a custom listener otherwise listens for you during build process.
     * @returns The express js application.
     */
    public static build(onComplete, customListener) {
        // process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

        const app = express();

        app.use(cors({
            origin: '*',
            methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
            allowedHeaders: 'content-type'
        }));
        app.use(bodyParser.json({ limit: '30mb' }));
        app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
        app.use(bodyParser.json());

        app.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'content-type');
            res.setHeader('Connection', 'keep-alive');
            next();
        });

        app.post('/config', async (req, res) => {
            try {
                const { gps, location, name, role, wallet } = req.body;
                interface IUser {
                    location?: string;
                    id?: string;
                    role?: string;
                    name?: string;
                }
                const existingUser: IUser = await readData('user');
                const user = { ...existingUser };

                if (gps || location) {
                    user.location = gps || location;
                }

                if (role) {
                    user.role = role;
                }

                if (name) {
                    user.name = name;
                }

                await writeData('user', user);

                if (wallet) {
                    fundWallet();
                }

                await res.send({
                    success: true
                });
            } catch (error) {
                console.log('config Error', error.message);
                res.send({
                    success: false,
                    error: error.message
                });
            }
        });

        app.post('/data', async (req, res) => {
            try {
                const { conversationId, deviceId, userId, schema } = req.body;
                if (conversationId && deviceId && userId && schema) {
                    await writeData('data', { id: conversationId, deviceId, userId, schema: JSON.stringify(schema) });
                }

                await res.send({
                    success: true
                });
            } catch (error) {
                console.log('data Error', error);
                res.send({
                    success: false,
                    error
                });
            }
        });

        app.get('/user', async (req, res) => {
            try {
                let user: any = await readData('user');
                if (!user || !user.id) {
                    // Creating a NEW Identity following the DID standard
                    const name = user && user.name ? user.name : '';
                    const role = user && user.role ? user.role : '';
                    const location = user && user.location ? user.location : '';
                    user = await createNewUserC2(name, role, location);
                }

                // Set TangleCommunicationService Address
                ServiceFactory.get<MqttService>('mqtt').setAddressToListenTo(user.address);

                const wallet: any = await readData('wallet');
                let newWallet;
                if (!wallet) {
                    newWallet = generateNewWallet();
                    await writeData('wallet', newWallet);
                }

                res.json({
                    ...user,
                    balance: (wallet ? await getBalance(wallet.address) : 0),
                    wallet: (wallet ? wallet.address : newWallet.address)
                });
            } catch (error) {
                console.log('get user error', error);
                res.send({ error });
            }
        });

        app.get('/wallet', async (req, res) => {
            try {
                const newWallet = generateNewWallet();
                console.log('Initiated new wallet generation', newWallet);
                const response = await axios.get(`${config.faucet}?address=${newWallet.address}&amount=${config.faucetAmount}`);
                const data = response.data;
                if (data.success) {
                    const balance = await getBalance(newWallet.address);
                    await writeData('wallet', { ...newWallet, balance });
                }
                console.log('Finished new wallet generation', newWallet);
                res.send({ newWallet });
            } catch (error) {
                console.log('fund wallet error', error);
                res.send({ error: 'fund wallet error' });
            }
        });

        app.get('/mam', async (req, res) => {
            const channelId = req.query.conversationId;
            const mam: any = await readData('mam', channelId);
            res.json({ ...mam });
        });

        app.post('/cfp', async (req, res) => {
            try {
                // 1. Create Tag
                const request: any = await generate(req.body);
                const submodelId = request.dataElements.submodels[0].identification.id;
                const tag = buildTag('callForProposal', submodelId);

                // 2. Create a DID Authentication Challenge
                try {
                    const verifiablePresentation = await createAuthenticationPresentationC2();
                    request.identification = {};
                    request.identification.didAuthenticationPresentation = verifiablePresentation.toJSON();

                } 
                //TODO: Is it correct that we try-catch here? Shouldnt the whole process abort if we fail this?
                catch (err) { console.log('Unable to create DID Authentication, does this instance have a correct DID? ', err); }

                // 3. Send transaction
                const user: any = await readData('user');
                const hash = await sendMessage({ ...request, userName: user.name }, tag);

                // 4. Create new MAM channel
                // 5. Publish first message with payload
                // 6. Save channel details to DB
                const channelId = request.frame.conversationId;
                const mam = await publish(channelId, request);

                console.log('CfP success', hash);
                res.send({
                    success: true,
                    tag,
                    hash,
                    mam,
                    request
                });
            } catch (error) {
                console.log('CfP Error', error);
                res.send({
                    success: false,
                    error
                });
            }
        });

        app.post('/proposal', async (req, res) => {
            try {
                // 1. Create Tag
                const request: any = await generate(req.body);
                const submodelId = request.dataElements.submodels[0].identification.id;
                const tag = buildTag('proposal', submodelId);

                // 2. Sign DID Authentication
                try {
                    //TODO: Migrate DID, same as in /cfp
                    const verifiablePresentation = await createAuthenticationPresentationC2();
                    request.identification = {};
                    request.identification.didAuthenticationPresentation = verifiablePresentation.toJSON();
                } catch (err) { console.log('Unable to create DID Authentication, does this instance have a correct DID? ', err); }

                // 3. Send transaction
                const user: any = await readData('user');
                const hash = await sendMessage({ ...request, userName: user.name }, tag);

                console.log('proposal success', hash);
                res.send({
                    success: true,
                    tag,
                    hash,
                    request
                });
            } catch (error) {
                console.log('proposal Error', error);
                res.send({
                    success: false,
                    error
                });
            }
        });

        //TODO: Migrate DID
        app.post('/acceptProposal', async (req, res) => {
            try {
                // 1. Retrieve MAM channel from DB
                // 2. Attach message with confirmation payload
                // 3. Update channel details in DB
                const request: any = await generate(req.body);
                const channelId = request.frame.conversationId;
                const mam = await publish(channelId, request);

                // 4. encrypt sensitive data using the public key from the MAM channel
                const id = request.frame.receiver.identification.id;
                mam.secretKey = await encryptWithReceiversPublicKey(id, 'keys-1', mam.secretKey);

                // 5. Create Tag
                const submodelId = request.dataElements.submodels[0].identification.id;
                const tag = buildTag('acceptProposal', submodelId);

                // 6. Send transaction, include MAM channel info
                const user: any = await readData('user');
                const hash = await sendMessage({ ...request, mam, userName: user.name }, tag);

                console.log('acceptProposal success', hash);
                res.send({
                    success: true,
                    tag,
                    hash,
                    mam,
                    request
                });
            } catch (error) {
                console.log('acceptProposal Error', error);
                res.send({
                    success: false,
                    error
                });
            }
        });

        app.post('/rejectProposal', async (req, res) => {
            try {
                // 1. Create Tag
                const request: any = await generate(req.body);
                const submodelId = request.dataElements.submodels[0].identification.id;
                const tag = buildTag('rejectProposal', submodelId);

                // 2. Send transaction
                const user: any = await readData('user');
                const hash = await sendMessage({ ...request, userName: user.name }, tag);

                console.log('rejectProposal success', hash);
                res.send({
                    success: true,
                    tag,
                    hash,
                    request
                });
            } catch (error) {
                console.log('rejectProposal Error', error);
                res.send({
                    success: false,
                    error
                });
            }
        });

        app.post('/informConfirm', async (req, res) => {
            try {
                // 1. Create Tag
                const request: any = await generate(req.body);
                const submodelId = request.dataElements.submodels[0].identification.id;
                const tag = buildTag('informConfirm', submodelId);

                // 2. Retrieve Wallet address from DB
                interface IWallet {
                    address?: string;
                }
                const wallet: IWallet = await readData('wallet');
                const { address } = wallet;

                const user: any = await readData('user');
                const payload = { ...request, walletAddress: address, userName: user.name };

                // 3. For data request include access credentials from DB
                if (config.dataRequest && config.dataRequest.includes(submodelId)) {
                    const conversationId = request.frame.conversationId;
                    payload.sensorData = await readData('data', conversationId);
                    if (!payload.sensorData) {
                        payload.sensorData = { ...config.demoSensorData, conversationId };
                    }
                }

                // 4. Retrieve MAM channel from DB
                // 5. Attach message with confirmation payload
                // 6. Update channel details in DB
                const channelId = request.frame.conversationId;
                await publish(channelId, payload);

                // 7. Send transaction, include MAM channel info
                const hash = await sendMessage(payload, tag);

                console.log('informConfirm success', hash);
                res.send({
                    success: true,
                    tag,
                    hash,
                    request
                });
            } catch (error) {
                console.log('informConfirm Error', error);
                res.send({
                    success: false,
                    error
                });
            }
        });

        app.post('/informPayment', async (req, res) => {
            try {
                const request: any = await generate(req.body);
                const user: any = await readData('user');

                // 1. Retrieve wallet
                const priceObject = request.dataElements.submodels[0].identification.submodelElements.find(({ idShort }) => ['preis', 'price'].includes(idShort));
                if (priceObject && priceObject.value) {
                    // 2. Add to payment queue
                    if (Number(priceObject.value) > 0) {
                        await addToPaymentQueue(request.walletAddress, Number(priceObject.value));
                    }
                    // 3. Retrieve MAM channel from DB
                    // 4. Attach message with confirmation payload
                    // 5. Update channel details in DB
                    const channelId = request.frame.conversationId;
                    await publish(channelId, request);

                    // 6. Create Tag
                    const submodelId = request.dataElements.submodels[0].identification.id;
                    const tag = buildTag('informPayment', submodelId);

                    // 7. Send transaction
                    const hash = await sendMessage({ ...request, userName: user.name }, tag);

                    console.log('informPayment success', hash);
                    res.send({
                        success: true,
                        tag,
                        hash,
                        request
                    });
                } else {
                    console.log('informPayment insufficient balance');
                    res.send({
                        success: false,
                        price: priceObject.value,
                        request
                    });
                }
            } catch (error) {
                console.log('informPayment', error);
                res.send({
                    success: false,
                    error
                });
            }
        });

        app.post('/mqtt', async (req, res) => {
            try {
                // 1. Create HelperClient
                // 2. Subscribe to zmq
                // 3. Post data under mqtt topic
                if (req.body.message === 'subscribe') {
                    const subscriptionId = await createHelperClient();
                    zmqToMQTT(subscriptionId);

                    res.send({
                        success: true,
                        id: subscriptionId
                    });

                } else if (req.body.message === 'unsubscribe') {
                    // 4. Unsubscribe from zmq with ID
                    const subscriptionId = req.body.subscriptionId;
                    unsubscribeHelperClient(subscriptionId);

                    res.send({
                        success: true,
                        id: subscriptionId
                    });
                }
            } catch (error) {
                console.log('MQTT Error', error);
                res.send({
                    success: false,
                    error
                });
            }
        });

        const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
        if (!customListener) {
            app.listen(port, () => {
                console.log(`Started API Server on port ${port} v${packageJson.version}`);

                if (onComplete) {
                    onComplete(app, config, port);
                }
            });
        } else {
            if (onComplete) {
                onComplete(app, config, port);
            }
        }

        return app;
    }
}
