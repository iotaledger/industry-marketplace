import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import packageJson from '../../package.json';
import config from '../config.json';
import { readData } from './databaseHelper';
import { getBalance } from './walletHelper';

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
            /*
                1. Create Tag
                2. Send transaction
                3. Create new MAM channel
                4. Publish first message with payload
                5. Save channel details to DB
            */
            console.log('CfP success');
            res.send({
                success: true,
                message: JSON.stringify(req.body)
            });
        });

        app.post('/proposal', async (req, res) => {
            /*
                1. Create Tag
                2. Send transaction
            */
            console.log('Proposal success');
            res.send({
                success: true,
                message: JSON.stringify(req.body)
            });
        });

        app.post('/acceptProposal', (req, res) => {
            /*
                1. Retrieve MAM channel from DB
                2. Attach message with confirmation payload
                3. Update channel details in DB
                4. Create Tag
                5. Send transaction, include MAM channel info
            */
            console.log('acceptProposal success');
            res.send({
                success: true,
                message: JSON.stringify(req.body)
            });
          });

        app.post('/rejectProposal', (req, res) => {
            /*
                1. Create Tag
                2. Send transaction
            */
            console.log('rejectProposal success');
            res.send({
                success: true,
                message: JSON.stringify(req.body)
            });
        });

        app.post('/informConfirm', (req, res) => {
            /*
                1. Retrieve MAM channel from DB
                2. Attach message with confirmation payload
                3. Update channel details in DB
                4. Create Tag
                5. Send transaction, include MAM channel info
            */
            console.log('informConfirm success');
            res.send({
                success: true,
                message: JSON.stringify(req.body)
            });
        });

        app.post('/informPayment', (req, res) => {
            /*
                1. Retrieve wallet, check balance
                2. Process payment
                3. Retrieve MAM channel from DB
                4. Attach message with payment confirmation payload
                5. Update channel details in DB
                6. Create Tag
                7. Send transaction, include payment transaction hash
            */
            console.log('informPayment success');
            res.send({
                success: true,
                message: JSON.stringify(req.body)
            });
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
