const io = require('socket.io');
const server = io.listen(7000)
const {zmqSubscribe} = require('./sub.js')



server.on('connection', client => {

  console.log("Client connected")
  console.log('sessionID ' + client.id)
  
  // Data Distribution from Administration Shell to client ; vice versa
 // client.on('config', (config) => server.emit('config', config))
 // client.on('cfp', (cfp) => server.emit('cfp', cfp))
 // client.on('serviceID', (id) => server.emit('serviceID', id))

   //ZMQ subscription 
   client.on('cfp', (tag) => client.emit('cfp', zmqSubscribe(tag, client, client.id)))
   client.on('proposal', (tag) => client.emit('proposal', zmqSubscribe(tag, client, client.id)))

  
    })

  