import axios from 'axios';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import packageJson from '../../package.json';
import config from '../config.json';
import { readData, writeData, readRow, readAllData, removeData } from './databaseHelper';
import { generateKeyPair, encryptWithReceiversPublicKey } from './encryptionHelper';
import { getLocationFromMessage } from './locationHelper';
import { publish, publishDID } from './mamHelper';
import { createHelperClient, unsubscribeHelperClient, zmqToMQTT } from './mqttHelper';
import { addToPaymentQueue } from './paymentQueueHelper';
import { buildTag } from './tagHelper';
import { sendMessage } from './transactionHelper';
import { getBalance } from './walletHelper';
import { createNewUser, CreateAuthenticationPresentation } from './credentialHelper';
import { generateNewWallet, fundWallet } from './walletHelper';

const provider = process.env.PROVIDER

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
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

        const app = express();

        app.use(cors());
        app.use(bodyParser.json({ limit: '30mb' }));
        app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
        app.use(bodyParser.json());

        app.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', `*`);
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'content-type');
            res.setHeader('Connection', 'keep-alive');
            next();
        });

        app.post('/config', async (req, res) => {
            try {

                const { location, name, role, wallet, usePaymentQueue } = req.body;
                interface IUser {
                    location?: string;
                    id?: string;
                    role?: string;
                    name?: string;
                    usePaymentQueue?: number;
                }
                const existingUser: IUser = await readData('user');
                const user = { ...existingUser };

                if (role) {
                    user.role = role;
                }

                if (name) {
                    user.name = name;
                }

                if (location) {
                    user.location = location;
                }

                user.usePaymentQueue = usePaymentQueue ? 1 : 0;

                if (name && (role === 'SR' || role === 'SP')) {
                    createNewUser(name, role, location);
                }
                if (wallet) {
                    const response = await axios.get(config.faucet);
                    const data = response.data;
                    if (data.success) {
                        await writeData('wallet', data.wallet);
                    }
                }

                await res.send({
                    success: true
                });
            } catch (error) {
                console.log('config Error', error);
                res.send({
                    success: false,
                    error
                });
            }
        });

        app.post('/createUser', async (req, res) => {
            try {
                console.log(req.body)
                const { role, name, location } = req.body;
                if (name && (role === 'SR' || role === 'SP') && location) {
                    createNewUser(name, role, location);
                }

                const wallet = generateNewWallet();
              await fundWallet(wallet)

                res.send({
                    success: true
                });
            } catch (error) {
                console.log('Wallet Error', error);
                res.send({
                    success: false,
                    error
                });
            }
        });

        app.post('/addWallet', async (req, res) => {
            try {
                const { seed, address, keyIndex, balance } = await req.body;
                if (seed && address) {
                    await writeData('wallet', { seed, address, keyIndex, balance });
                }
                res.send({
                    success: true
                });
            } catch (error) {
                console.log('Wallet Error', error);
                res.send({
                    success: false,
                    error
                });
            }
        });


        app.post('/data', async (req, res) => {
            try {
                const { conversationId, deviceId, userId, schema } = req.body;
                if (conversationId && deviceId && userId && schema) {
                    await writeData('data', { id: conversationId, deviceId, userId, schema: JSON.stringify(schema) });
                }

                res.send({
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
            let user: any = await readData('user');

            const wallet: any = await readData('wallet');
            const address = (wallet && wallet.address) || null;
            const balance = await getBalance(address);

            if (!user || !user.id) {
                // Generate key pair
                const { publicKey, privateKey }: any = await generateKeyPair();
                const root = await publishDID(publicKey, privateKey);
                await writeData('did', { root, privateKey });
                const id = `did:iota:${root}`;
                user = user ? { ...user, id } : { id };
                await writeData('user', user);
            }

            res.json({ ...user, balance, wallet: address });
        });

        app.get('/allUsers', async (req, res) => {

            let user: any = await readAllData('user');

            res.json({ ...user });
        });


        app.get('/mam', async (req, res) => {
            const channelId = req.query.conversationId;
            const mam: any = await readData('mam', channelId);
            res.json({ ...mam });
        });


        app.post('/clear', async (req, res) => {
            console.log("req.body", req.body)
            const { table } = req.body;
            await removeData(table);
            let data: any = await readAllData(table);
            res.json({ ...data });
        });


        app.get('/allWallets', async (req, res) => {

            const wallet: any = await readAllData('wallet');

            res.json({ ...wallet });
        });


        app.get('/mam', async (req, res) => {
            const channelId = req.query.conversationId;
            const mam: any = await readData('mam', channelId);
            res.json({ ...mam });
        });

        app.post('/cfp', async (req, res) => {
            try {
                // 1. Create Tag
                const location = getLocationFromMessage(req.body);
                const submodelId = req.body.dataElements.submodels[0].identification.id;
                const tag = buildTag('callForProposal', location, submodelId);
                const userDID = req.body.frame.sender.identification.id;
                const id = userDID.replace('did:IOTA:', '')
                const did: any = await readRow('did', 'root', id)
                const verifiablePresentation = await CreateAuthenticationPresentation(provider, did);
                req.body.identification = {};
                req.body.identification.didAuthenticationPresentation = verifiablePresentation.EncodeToJSON();

                const { name }: any = await readRow('user', 'id', userDID)
                // 2. Send transaction
                const hash = await sendMessage({ ...req.body, userName: name }, tag);
                // 3. Create new MAM channel
                // 4. Publish first message with payload
                // 5. Save channel details to DB
                const channelId = req.body.frame.conversationId;
                const mam = await publish(channelId, req.body);

                console.log('CfP success', hash);
                res.send({
                    success: true,
                    tag,
                    hash,
                    mam
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
                const location = await getLocationFromMessage(req.body);
                const submodelId = req.body.dataElements.submodels[0].identification.id;
                const tag = await buildTag('proposal', location, submodelId);
                const userDID = req.body.frame.sender.identification.id
                const id = userDID.replace('did:IOTA:', '')


                interface IDid {
                    root?: string;
                    privateKey?: string;
                }
                const did: IDid = await readRow('did', 'root', id)

                //1.25 Sign DID Authentication
                const verifiablePresentation = await CreateAuthenticationPresentation(provider, did);
                req.body.identification = {};
                req.body.identification.didAuthenticationPresentation = verifiablePresentation.EncodeToJSON();

                const { name }: any = await readRow('user', 'id', userDID)

                const payload = { ...req.body, userName: name }
                const hash = await sendMessage(payload, tag);


                console.log('proposal success', hash);
                res.send({
                    success: true,
                    tag,
                    hash
                });
            } catch (error) {
                console.log('proposal Error', error);
                res.send({
                    success: false,
                    error
                });
            }
        });

        app.post('/acceptProposal', async (req, res) => {
            try {
                // 1. Retrieve MAM channel from DB
                // 2. Attach message with confirmation payload
                // 3. Update channel details in DB
                const channelId = req.body.frame.conversationId;
                const mam = await publish(channelId, req.body);


                // 4. encrypt sensitive data using the public key from the MAM channel
                const id = req.body.frame.receiver.identification.id;
                mam.secretKey = await encryptWithReceiversPublicKey(id, "keys-1", mam.secretKey);

                // 5. Create Tag
                const location = getLocationFromMessage(req.body);
                const submodelId = req.body.dataElements.submodels[0].identification.id;
                const tag = buildTag('acceptProposal', location, submodelId);

                const userDID = req.body.frame.sender.identification.id;
                const { name }: any = await readRow('user', 'id', userDID)

                // 6. Send transaction, include MAM channel info
                const hash = await sendMessage({ ...req.body, mam, userName: name }, tag);

                console.log('acceptProposal success', hash);
                res.send({
                    success: true,
                    tag,
                    hash,
                    mam
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
                const location = getLocationFromMessage(req.body);
                const submodelId = req.body.dataElements.submodels[0].identification.id;
                const tag = buildTag('rejectProposal', location, submodelId);

                const userDID = req.body.frame.sender.identification.id;

                const { name }: any = await readRow('user', 'id', userDID)

                // 2. Send transaction
                const hash = await sendMessage({ ...req.body, userName: name }, tag);

                console.log('rejectProposal success', hash);
                res.send({
                    success: true,
                    tag,
                    hash
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
                const location = getLocationFromMessage(req.body);
                const submodelId = req.body.dataElements.submodels[0].identification.id;
                const tag = buildTag('informConfirm', location, submodelId);

                // 2. Retrieve Wallet address from DB
                interface IWallet {
                    address?: string;
                    balance?: number;
                    keyIndex?: number;
                    seed?: string;
                }

                const wallet: IWallet = await readData('wallet');
                const { address } = wallet;

                const userDID = req.body.frame.sender.identification.id;


                const { name }: any = await readRow('user', 'id', userDID)

                const payload = { ...req.body, walletAddress: address, userName: name };


                // 3. For data request include access credentials from DB
                if (config.dataRequest && config.dataRequest.includes(submodelId)) {
                    const conversationId = req.body.frame.conversationId;
                    payload.sensorData = await readData('data', conversationId);
                    if (!payload.sensorData) {
                        console.log("add sensor data")
                        payload.sensorData = { ...config.demoSensorData, conversationId };
                    }
                    console.log(JSON.stringify(payload))
                }

                // 4. Retrieve MAM channel from DB
                // 5. Attach message with confirmation payload
                // 6. Update channel details in DB
                const channelId = req.body.frame.conversationId;
                await publish(channelId, payload);

                // 7. Send transaction, include MAM channel info
                const hash = await sendMessage(payload, tag);

                console.log('informConfirm success', hash);
                res.send({
                    success: true,
                    tag,
                    hash
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
                const userDID = req.body.frame.sender.identification.id;

                // 1. Retrieve wallet
                const priceObject = req.body.dataElements.submodels[0].identification.submodelElements.find(({ idShort }) => ['preis', 'price'].includes(idShort));
                if (priceObject && priceObject.value) {
                    const recepientAddress = req.body.walletAddress;

                    console.log("Add to Payment Queue")
                    // 2. Add to payment queue
                    await addToPaymentQueue(recepientAddress, Number(priceObject.value));


                    // 3. Retrieve MAM channel from DB
                    // 4. Attach message with confirmation payload
                    // 5. Update channel details in DB
                    const channelId = req.body.frame.conversationId;
                    await publish(channelId, req.body);

                    // 6. Create Tag
                    const location = getLocationFromMessage(req.body);
                    const submodelId = req.body.dataElements.submodels[0].identification.id;
                    const tag = buildTag('informPayment', location, submodelId);

                    const { name }: any = await readRow('user', 'id', userDID)


                    // 7. Send transaction
                    const hash = await sendMessage({ ...req.body, userName: name }, tag);

                    console.log('informPayment success', hash);
                    res.send({
                        success: true,
                        tag,
                        hash
                    });
                } else {
                    console.log('informPayment insufficient balance');
                    res.send({
                        success: false,
                        price: priceObject.value
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
        const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
        if (!customListener) {
            app.listen(port, async err => {
                if (err) {
                    throw err;
                }

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