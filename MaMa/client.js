const io = require('socket.io-client');
const { sendToTangle, buildTag, alterTag } = require('./Functions.js');



const actOnProposal = (req) => {
  var socket = io.connect("http://localhost:7000");
  console.log("Configured as SP")

  var tag = buildTag(req)
  sendToTangle(JSON.stringify(req), tag)

  console.log("proposal send with tag" + tag)
  newtag = alterTag(tag, 'callForProposal')
  console.log("SP subscribes to " + newtag)

  socket.emit('cfp', newtag  )
  socket.on('cfp', (data) =>{
    if (data != null){
       console.log("New CFP from Tangle:" + data)
       return data
    }
      })
    }

    
const actOnCallForProposal = (req) => {
  
  var socket1 = io.connect("http://localhost:7000");
  console.log("MaMa received a cfp from AAS")
    
    var tag = buildTag(req)
    sendToTangle(JSON.stringify(req), tag)

  //Alter tag to listen to proposals
  newtag = alterTag(tag, 'proposal')
  console.log('SR-MaMa subscribes to tag:' + newtag)
  //Subscribe to ZMQ events with tag for proposals
  socket1.emit('proposal', newtag )
  socket1.on('proposal', (data) => {
   if (data != null){
    console.log("New Proposal from Tangle:" + data)  
    return data
  }
}) 
  


}


module.exports = {
  actOnProposal,
  actOnCallForProposal
}
