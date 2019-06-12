const io = require('socket.io-client');

var socket = io.connect("http://localhost:3000");
            // use your socket
            var msg = "MBPCHDRCWCWBTCICWB9CFA99999"

//socket.on('Conf', (data) => console.log(data))           
// socket.emit('SR', msg)
// socket.on('SR', (data) => console.log(data))

 //socket.emit('SP', msg)
// socket.on('SP', (data) => console.log(data))

socket.emit('subscribe', msg )
socket.on('subscribe', (data) => console.log(data))   