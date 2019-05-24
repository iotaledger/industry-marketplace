

# MaMa
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




## Files
* wallet.js file
    * Creates public address from seed to fill wallet with IOTA-Dev-tokens and gives out balance

* transaction.js
    * Creates transaction in Devnet

* zmq
    * Connects to zmq node, fetches transactions under a certain tag and gives out the encoded message


##Others
* npm install @iota/core
```sh
 sudo chown -R <usr> <path>
```
