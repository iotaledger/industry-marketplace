import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import packageJson from '../../package.json';
import config from '../config.json';
import { readData } from './databaseHelper';
import { getBalance, processPayment } from './walletHelper';
import { buildTag } from './tagHelper';
import { sendMessage } from './transactionHelper';
import { publish } from './mamHelper';


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

        // Set up a whitelist and check against it:
        // const whitelist = ['http://localhost', 'http://localhost:3000'];
        // const corsOptions = {
        //     origin: (origin, callback) => {
        //         if (whitelist.indexOf(origin) !== -1) {
        //             callback(null, true);
        //         } else {
        //             callback(new Error('Not allowed by CORS'));
        //         }
        //     }
        // };

        // app.use(cors(corsOptions));
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
                //0. Get location 
                const location = req.body.location
                const submodelId = req.body.dataElements.submodels[0].identification.id

                //2. Create Tag     
                const tag = await buildTag('callForProposal', location, submodelId);

                //2. Send transaction
                // Try purchase
                await sendMessage(req.body, tag);

                // 3. Create new MAM channel
                // 4. Publish first message with payload
                // 5. Save channel details to DB
                const channelId = req.body.frame.conversationId

                await publish(channelId, req.body);

                console.log('CFP success');
                res.send({
                    success: true,
                    message: JSON.stringify(req.body)
                });

            } catch (error) {
                console.log('CFP fail', error)
                res.send({
                    success: false,
                    message: JSON.stringify(req.body)
                });
            }

        });

        app.post('/proposal', async (req, res) => {

            try {
                //0. Get location 
                const location = req.body.location
                const submodelId = req.body.dataElements.submodels[0].identification.id

                //  1. Create Tag
                const tag = await buildTag('proposal', location, submodelId);

                //2. Retrieve Wallet address from DB

                interface IWallet {
                    address?: string;
                }
                const wallet: IWallet = await readData('wallet');
                const { address } = wallet;

                //  3. Send transaction, include wallet address
                req.body.frame.sender.walletAddress = address
                await sendMessage(req.body, tag);

                console.log('Proposal success');
                res.send({
                    success: true,
                    message: JSON.stringify(req.body)
                });
            } catch (error) {
                console.log('Proposal fail', error)
                res.send({
                    success: false,
                    message: JSON.stringify(req.body)
                });
            }

        });

        app.post('/acceptProposal', async (req, res) => {

            try {
                //4.Get location 
                const location = req.body.location
                const submodelId = req.body.dataElements.submodels[0].identification.id

                //  5. Create Tag
                const tag = await buildTag('acceptProposal', location, submodelId);

                // 1. Retrieve MAM channel from DB
                const channelId = req.body.frame.conversationId

                //  2. Attach message with confirmation payload
                //  3. Update channel details in DB
                const mamInfo = await publish(channelId, req.body)

                //  6. Send transaction, include MAM channel info
                req.body.mamInfo = mamInfo
                await sendMessage(req.body, tag);

                console.log('acceptProposal success');
                res.send({
                    success: true,
                    message: JSON.stringify(req.body)
                });

            } catch (error) {
                console.log('acceptProposal fail', error)
                res.send({
                    success: false,
                    message: JSON.stringify(req.body)
                });
            }

        });

        app.post('/rejectProposal', async (req, res) => {
            try {
                //0. Get location 
                const location = req.body.location
                const submodelId = req.body.dataElements.submodels[0].identification.id

                // 1. Create Tag
                const tag = await buildTag('rejectProposal', location, submodelId);

                //  2. Send transaction
                await sendMessage(req.body, tag);


                console.log('rejectProposal success');
                res.send({
                    success: true,
                    message: JSON.stringify(req.body)
                });

            } catch (error) {
                console.log('rejectProposal fail', error)
                res.send({
                    success: false,
                    message: JSON.stringify(req.body)
                });
            }

        });
        app.post('/informConfirm', async (req, res) => {

            try {
                //0. Get location 
                const location = req.body.location
                const submodelId = req.body.dataElements.submodels[0].identification.id

                // 1. Retrieve MAM channel from DB
                const channelId = await req.body.frame.conversationId

                //  2. Attach message with confirmation payload
                //   3. Update channel details in DB
                const mamInfo = await publish(channelId, req.body)

                //  4. Create Tag
                const tag = await buildTag('informConfirm', location, submodelId);

                //  5. Send transaction, include MAM channel info
                req.body.mamInfo = mamInfo
                await sendMessage(req.body, tag);


                console.log('informConfirm success');
                res.send({
                    success: true,
                    message: JSON.stringify(req.body)
                });

            } catch (error) {
                console.log('informConfirm fail', error)
                res.send({
                    success: false,
                    message: JSON.stringify(req.body)
                });
            }

        });

        app.post('/informPayment', async (req, res) => {

            try {
                //Get address from req.body, here just for testing 
                const address = 'HELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDD'
                const value = 3

                //  1. Retrieve wallet, check balance
                //  2. Process payment
                const paymentHash = await processPayment(address, value)

                console.log("Paymenthash:", paymentHash)


                // 3. Retrieve MAM channel from DB
                const channelId = await req.body.frame.conversationId

                //   4. Attach message with payment confirmation payload
                //   5. Update channel details in DB
                await publish(channelId, req.body)

                //0. Get location 
                const location = req.body.location
                const submodelId = req.body.dataElements.submodels[0].identification.id

                //  4. Create Tag
                const tag = await buildTag('informPayment', location, submodelId);

                //  5. Send transaction, include payment transaction has 
                req.body.paymentHash = await paymentHash
                await sendMessage(req.body, tag);


                console.log('informPayment success');
                res.send({
                    success: true,
                    message: JSON.stringify(req.body)
                });

            } catch (error) {
                console.log('informPayment fail', error)
                res.send({
                    success: false,
                    message: JSON.stringify(req.body)
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
