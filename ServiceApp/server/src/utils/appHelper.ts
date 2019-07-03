import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
// import uuid from 'uuid/v4';
import { readData /*, removeData */ } from './databaseHelper';
import { getBalance, processPayment } from './walletHelper';

// import { fetchFromChannelId, publish } from './mamHelper';

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
        const packageJson = require('../../package.json');
        const config = require(`../config.json`);

        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

        const app = express();

        // Set up a whitelist and check against it:
        const whitelist = ['http://localhost', 'http://localhost:3000']
        const corsOptions = {
            origin: function (origin, callback) {
                if (whitelist.indexOf(origin) !== -1) {
                    callback(null, true)
                } else {
                    callback(new Error('Not allowed by CORS'))
                }
            }
        }

        app.use(cors(corsOptions));
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
            const user = await readData('user');
            const wallet = await readData('wallet');
            console.log(req.body);
            console.log(user);
            console.log(wallet);
            res.send({
                success: true,
                message: JSON.stringify(req.body),
                user,
                wallet
            });
        });

        app.post('/proposal', async (req, res) => {
            const address = 'AKDNWKHUEBXMKZPOLFPQJQOSXDEWLB9LZPCQKCLHPETEDBWORBWHOIGB9YLYIYIUU9ZWRIUNGGVQBZIEC9BWYFZGRW';
            const transactions = await processPayment(address, 5);

            if (transactions.length > 0) {
                console.log('Success');
            }
            
            res.send({
                message: JSON.stringify(req.body)
            });
        });

        app.post('/acceptProposal', (req, res) => {
            console.log(req.body);
            res.send({
              message: JSON.stringify(req.body),
            });
          });
          
        app.post('/rejectProposal', (req, res) => {
            console.log(req.body);
            res.send({
                message: JSON.stringify(req.body),
            });
        });
          
        app.post('/informConfirm', (req, res) => {
            console.log(req.body);
            res.send({
                message: JSON.stringify(req.body),
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
