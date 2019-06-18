
# Market Manager

## Prerequisites
* Node.js 8
* npm (included in Node.js)

## Setup
1. Install the iota library
```sh
npm install @iota/core
```

2. Install the zmq library
```sh
npm install zeromq --save
```

3. Install Socket.io
```sh
npm install socket.io
```

4. Install Socket.io
```sh
npm install socket.io-client
```

## Run 

Clone, go to directory and 'npm install' the ServiceApp.
Then 'npm start' the ServiceApp  and it will you an examplary UI for the MarketManager. 

Open 2 Terminals, direct one to 'MaMa' folder, the other one to 'ServiceApp' folder. 
Type in both terminals 'node server.js' 

The one in the 'MaMa' folder starts the websocket server that connects later on with the ZMQ. 
The other one is the server for the API with the UI.

Now press "create Offer" to send out a Proposal and start listening to CallForProposals, just submit the empty form, an example JSON will be send out. 
As soon as you press the other button "create Request", a CFP is created and appears in the terminal as "New CFP from Tangle...", which belongs to the code of the Service Provider.  

Important: 


Since it wasn't clear what is send out for the Service Provider (E.g. already pro-active Proposal, just a config file with serviceID... ), I just chose this approach, to show that basic functionalities are working. 

To check whether ServiceProvider and ServiceRequester only get relevant messages, it's nice to use the transaction.js function and adapt its tag. 



## Explanation of functions 


### client.js 


A client can either act as a Service Provider or a Service Requestor.
Client.js includes all functions that have to be executed by either a SP or SR. 

Depending on what type of message the client receives from the UI (/Asset Administration Shell) certain functions within this file are triggered. It starts subscribing to certain ZMQ Topics, sends messages to the tangle etc. 

Dunring the process the Tag of the messages are changing since the different type of messages are hidden behind different letters. However, since the other letters stay the same, it is sufficient to alter the tag with the "alterTag" function which needs the new type of message and the old tag as an input. 

### server.js 

The server receives and distributes messages via socket.io 
With server.emit(...) messages are forwarded to all connected clients 
client.emit() only refers to current instance of the client

Wtihin the server.js the connection to the ZMQ is created by calling the ZMQsubscribe function 

### sub.js 

Subscribes to certain ZMQ events, filters all events for the input tag and decodes only those messages
According to what type of message the client is subscribing, the messages are published via the websockets.


### helpers.js

Helper functions 


### wallet.js 

Creates public address from seed to fill wallet with IOTA-Dev-tokens and gives out balance

### transaction.js

Creates transaction in Devnet. Useful to test current state of implementation. 

