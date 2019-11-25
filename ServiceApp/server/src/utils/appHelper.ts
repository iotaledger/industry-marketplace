// tslint:disable-next-line:no-require-imports
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import packageJson from '../../package.json';
import config from '../config.json';
import { writeData, readRow, removeData } from './databaseHelper';


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
       
        app.post('/restartMetric', async (req, res) => { 

            let cfpCounter: any = await readRow('metric','context', 'cfp');
            let proposalCounter: any = await readRow('metric','context', 'proposal');
            let informPaymentCounter: any = await readRow('metric','context', 'informPayment');

            await removeData('metric')
            await writeData('metric', {"context": "cfp", "counter": 0})
            await writeData('metric', {"context": "proposal", "counter": 0})
            await writeData('metric', {"context": "informPayment", "counter": 0})
            res.json({ 'success': true,  'previousCFPCounter': cfpCounter, 'previousProposalCounter': proposalCounter, 'previousInformPaymentCounter': informPaymentCounter});
        });

        app.post('/getMetric', async (req, res) => {
        
            let cfpCounter: any = await readRow('metric','context', 'cfp');
            let proposalCounter: any = await readRow('metric','context', 'proposal');
            let informPaymentCounter: any = await readRow('metric','context', 'informPayment');
          
            res.send({cfpCounter , proposalCounter, informPaymentCounter })
            
        });

    
        const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
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
