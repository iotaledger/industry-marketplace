const { sendToTangle, buildTag, alterTag } = require('./Functions.js');
//const {buildTag, alterTag} = require('./helpers.js')

const io = require('socket.io-client');
var socket = io.connect("http://localhost:3000");


//Listen to configuration
socket.on('config', (role) => {

    if( role === "SR"){

        console.log("Client is a SR")
        serviceRequester()
    }
    else{
        console.log("Client is a SP")
        serviceProvider()
    }

})


const serviceRequester = () => {

    //As SR listen on cfp from Asset Administration Shell
    socket.on('cfp', (data) => {
      //Extract messageType and ServiceId from received CFP and build Tag according to documentation 
      var messageType = data.frame.type
      var id =  data.dataElements.submodels[0].identification.id 
  
      var tag = buildTag(messageType, id)
      sendToTangle(JSON.stringify(data), tag)

      //Current tag is made for a Call For Proposal, now client wants to subscribe to proposals 
      //Therefore alter the tag before subscribing
      tag = alterTag(tag, 'proposal')
      
      //Subscribe to ZMQ events with tag for proposals
      socket.emit('subscribe', tag )
      socket.on('subscribe', (data) => console.log(data))
    }) 
}

const serviceProvider = () => {

    var tag;
    
    //Service Provider only gets serviceID from Administration Shell 
    socket.on('serviceID', (data) => {
        //From that build Tag to listen to callForProposals for the offered service 
        tag =  buildTag('callForProposal', data)
        socket.emit('subscribe', tag)
        console.log("SP is listening to transactions with tag " + tag)
    })

    //When cfp comes in send the cfp to the Asset Administration Shell 
    socket.on('subscribe', (data) => socket.emit('cfp', data))   

    //socket.on('proposal', (proposal) => {
   // tag = alterTag(tag, 'proposal')
   // sendToTangle(proposal, tag)


   // })
}


