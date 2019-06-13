
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

### As Service Provider

Change role to "SP" in UI.js and save file

Open 4 Terminals

1. Terminal: node server.js
2. Terminal: node client.js 
3. Terminal: node UI.js 
4. Terminal: node transaction.js 

Output: 

Client is configured via Interface and listens to ZMQ transactions with defined tag. Transactions.js sends a message unter the defined tag. 
Finally, client receives the message and sends it back to the interface 
In terminal of UI.js the message is displayed 

### As Service Requester

Change role to "SR" in UI.js and save file

Open 4 Terminals

1. Terminal: node server.js
2. Terminal: node client.js 
3. Terminal: node UI.js 

Client receives CFP JSON string from UI.js 
From extracted elements, the tag is created 
Client sends CFP under defined Tag to tangle and displays result 

Output: 

Client is configured via Interface and listens to ZMQ transactions with defined tag. Transactions.js sends a message unter the defined tag. 
Finally, client receives the message and sends it back to the interface 
In terminal of UI.js the message is displayed 

## Explaination of functions 


### UI.js 

This file simulates the interface between the MarketManager and the Asset Administration Shell. 
Configurations for the clients are hardcoded and send to the server via socket.io 
The server distributes the content to the client. 

In case of a ServiceProvider it is assumed that in the beginning only the ServiceID are known for the Market Manager to start looking for Call For Proposals. 

Depending on the configuration of the client, the UI.js sends out JSON strings as they are expected from the Asset Administration shell. (cfp, proposal...) 


### client.js 

A client can either act as a Service Provider or a Service Requestor. 
It gets configured via socket.io with topic 'config', which is controlled by UI.js 

Depending on the configuration, the client.js listens to certain socket.io topics to get input from the Asset Administration Shell (or here from the UI.js) 

Depending on the message, it starts subscribing to certain ZMQ Topics, sends messages to the tangle or starts listening to other socket.io topics. 

Dunring the process the Tag of the messages are changing since the different type of messages are hidden behind different letters. However, since the other letters stay the same, it is sufficient to alter the tag with the "alterTag" function which needs the new type of message and the old tag as an input. 

### server.js 

The server receives and distributes messages via socket.io 
With server.emit(...) messages are forwarded to all connected clients 
client.emit() only refers to current instance of the client

UI.js -> server.js -> client.js
client.js -> server.js -> UI.js

-> socket.io 


### sub.js 

Subscribes to certain ZMQ events, filters all events for the input tag and decodes only those messages

### helpers.js

Helper functions 


### wallet.js 

Creates public address from seed to fill wallet with IOTA-Dev-tokens and gives out balance

### transaction.js

Creates transaction in Devnet

### zmq.js

Connects to zmq node, fetches transactions under a certain tag and gives out the encoded message




