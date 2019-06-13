const io = require('socket.io');
const server = io.listen(3000)
const {zmqSubscribe} = require('./sub.js')


server.on('connection', client => {

   //Data Distribution from Administration Shell to client ; vice versa
   client.on('config', (config) => server.emit('config', config))
   client.on('cfp', (cfp) => server.emit('cfp', cfp))
   client.on('serviceID', (id) => server.emit('serviceID', id))

   //ZMQ subscription 
   client.on('subscribe', (tag) => client.emit('subscribe', zmqSubscribe(tag, client)))
  
    })
