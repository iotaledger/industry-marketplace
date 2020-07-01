import { FailMode, LinearWalkStrategy, LoadBalancerSettings, SuccessMode } from '@iota/client-load-balancer';
import { Server } from 'http';
import SocketIO from 'socket.io';
import { depth, minWeightMagnitude, providers } from './config.json';
import { ServiceFactory } from './factories/serviceFactory';
import { zmqSubscribe } from './routes/zmqSubscribe';
import { zmqUnsubscribe } from './routes/zmqUnsubscribe';
import { ZmqService } from './services/zmqService';
import { AppHelper } from './utils/appHelper';

AppHelper.build(
    (app, config, port) => {
        ServiceFactory.register('zmq', () => new ZmqService(config.zmq));

        const loadBalancerSettings: LoadBalancerSettings = {
            nodeWalkStrategy: new LinearWalkStrategy(
                providers.map(provider => ({ provider }))
            ),
            depth,
            mwm: minWeightMagnitude,
            successMode: SuccessMode.keep,
            failMode: FailMode.all,
            timeoutMs: 10000,
            failNodeCallback: (node, err) => {
                console.log(`Failed node ${node.provider}, ${err.message}`);
            }
        };
        ServiceFactory.register('load-balancer-settings', () => loadBalancerSettings);
    
        const server = new Server(app);
        const socketServer = SocketIO(server);

        server.listen(port);

        socketServer.on('connection', (socket) => {
            socket.on('subscribe', (data) => socket.emit('subscribe', zmqSubscribe(config, socket, data)));
            socket.on('unsubscribe', (data) => socket.emit('unsubscribe', zmqUnsubscribe(config, socket, data)));
        });
    },
    true);
