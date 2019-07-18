import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import packageJson from '../../package.json';
import config from '../config.json';
import { readData } from './databaseHelper';
import { getLocationFromMessage } from './locationHelper';
import { publish } from './mamHelper';
import { buildTag } from './tagHelper';
import { sendMessage } from './transactionHelper';
import { getBalance, processPayment } from './walletHelper';

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

            next();
        });

        app.post('/config', async (req, res) => {
            try {
                // save to DB
                console.log('config success');
                res.send({
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

        app.get('/user', async (req, res) => {
            interface IUser {
                id?: string;
                role?: string;
            }
            const user: IUser = await readData('user');

            interface IWallet {
                address?: string;
            }
            const wallet: IWallet = await readData('wallet');
            const { address } = wallet;
            const balance = await getBalance(address);

            res.json({ ...user, balance });
        });

        app.post('/cfp', async (req, res) => {
            try {
                // 1. Create Tag
                const location = getLocationFromMessage(req.body);
                const submodelId = req.body.dataElements.submodels[0].identification.id;
                const tag = buildTag('callForProposal', location, submodelId);
                
                // 2. Send transaction
                const hash = await sendMessage(req.body, tag);

                // 3. Create new MAM channel
                // 4. Publish first message with payload
                // 5. Save channel details to DB
                const channelId = req.body.frame.conversationId;
                const mam = await publish(channelId, req.body);

                console.log('CfP success');
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
                const location = getLocationFromMessage(req.body);
                const submodelId = req.body.dataElements.submodels[0].identification.id;
                const tag = buildTag('proposal', location, submodelId);

                // 2. Send transaction
                const hash = await sendMessage(req.body, tag);

                console.log('proposal success');
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

                // 4. Create Tag
                const location = getLocationFromMessage(req.body);
                const submodelId = req.body.dataElements.submodels[0].identification.id;
                const tag = buildTag('acceptProposal', location, submodelId);

                // 5. Send transaction, include MAM channel info
                const hash = await sendMessage({ ...req.body, ...mam }, tag);

                console.log('acceptProposal success');
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

                // 2. Send transaction
                const hash = await sendMessage(req.body, tag);

                console.log('rejectProposal success');
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
                /*
                // 1. Retrieve MAM channel from DB
                // 2. Attach message with confirmation payload
                // 3. Update channel details in DB
                const channelId = req.body.frame.conversationId;
                const mam = await publish(channelId, req.body);
                */

                // 4. Create Tag
                const location = getLocationFromMessage(req.body);
                const submodelId = req.body.dataElements.submodels[0].identification.id;
                const tag = buildTag('informConfirm', location, submodelId);

                // 5. Retrieve Wallet address from DB
                interface IWallet {
                    address?: string;
                }
                const wallet: IWallet = await readData('wallet');
                const { address } = wallet;

                // 6. Send transaction, include MAM channel info
                // const hash = await sendMessage({ ...req.body, ...mam }, tag);
                const hash = await sendMessage({ ...req.body, walletAddress: address }, tag);

                console.log('informConfirm success');
                res.send({
                    success: true,
                    tag,
                    hash
                    // mam
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
                // 1. Retrieve wallet
                const priceObject = req.body.dataElements.submodels[0].identification.submodelElements.find(({ idShort }) => idShort === 'preis');
                if (priceObject && priceObject.value) {
                    // 2. Process payment
                    const recepientAddress = req.body.walletAddress;
                    const transactions = await processPayment(recepientAddress, Number(priceObject.value));

                    if (transactions.length < 1) {
                        throw new Error(`processPayment Error: ${transactions}`);
                    }

                    // 3. Retrieve MAM channel from DB
                    // 4. Attach message with confirmation payload
                    // 5. Update channel details in DB
                    const channelId = req.body.frame.conversationId;
                    const mam = await publish(channelId, req.body);

                    // 6. Create Tag
                    const location = getLocationFromMessage(req.body);
                    const submodelId = req.body.dataElements.submodels[0].identification.id;
                    const tag = buildTag('informPayment', location, submodelId);

                    // 7. Send transaction, include MAM channel info
                    const hash = await sendMessage({ ...req.body, ...mam }, tag);

                    console.log('informPayment success');
                    res.send({
                        success: true,
                        tag,
                        hash,
                        mam
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

        const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
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
