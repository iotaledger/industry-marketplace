import { Server } from 'http';
import SocketIO from 'socket.io';
import { ServiceFactory } from './factories/serviceFactory';
import { zmqSubscribe } from './routes/zmqSubscribe';
import { zmqUnsubscribe } from './routes/zmqUnsubscribe';
import { ZmqService } from './services/zmqService';
import { AppHelper } from './utils/appHelper';


AppHelper.build(
    (app, config) => {
        ServiceFactory.register('zmq', () => new ZmqService(config.zmq));

        const server = new Server(app);
        const socketServer = SocketIO(server,  { pingTimeout: 60000});

     //   server.listen(process.env.PORT);
        server.listen(process.env.PORT);


        socketServer.on('connection', (socket) => {
            socket.on('subscribe', (data) => socket.emit('subscribe', zmqSubscribe(config, socket, data)));
            socket.on('unsubscribe', (data) => socket.emit('unsubscribe', zmqUnsubscribe(config, socket, data)));
        });
    },
    true);
