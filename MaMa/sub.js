// subber.js
var zmq = require('zeromq'),
  sock = zmq.socket('sub');
var fs = require('fs');
var events = require('events');
var eventEmitter = new events.EventEmitter();
const { sendToUI, fetchFromTangle } = require('./Functions.js');


function sub(ZMQ_ENDPOINT, tag)  {

  sock.connect(ZMQ_ENDPOINT);
  sock.subscribe('tx');
  console.log('Subscriber connected to ZMQ');

  sock.on('message', msg => {
    const data = msg.toString().split(' ');

    if (data[12] === tag) {

       const get = async () => {
       const message = await fetchFromTangle(data);

       tag.split("")

       if (tag[8] === "A" ){
        eventEmitter.emit('cfp', message)
       }
       if (tag[8] === "B" ){
        eventEmitter.emit('proposal', message)
       }

       
 
    };
    get();
  }
    
    
  });

  return eventEmitter

}
 

exports.zmqSubscribe = (tag, client, id) => {

const Sub = new sub("tcp://zmq.devnet.iota.org:5556", tag)
console.log("CLIENT:" + client.id + "folgt" + tag)

    Sub.on('cfp', function(msg){
      client.emit('cfp', msg)
   })

   Sub.on('proposal', function(msg){
   client.emit('proposal', msg)
})
  }

  
 