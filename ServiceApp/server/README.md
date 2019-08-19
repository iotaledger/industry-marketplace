# IOTA MarketManager

<!-- TABLE OF CONTENTS -->
## Table of Contents 
* [About the Project](#about-the-project)
* [Prerequisites](#pre-requisites)
* [Development](#development)
* [API Description](#api-description)
* [Websocket Connection](#websocket-connection)
* [Industry 4.0 Semantic](#industry-4.0-semantic)
 
 
<!-- Pre-requisites -->
### About the Project
 ![architectureV2](docs/architectureV2.png?raw=true)
 
 
#### Digital Identity and Encryption 
Within the SeMarket, every entity recieves a decentralized identifiers (DIDs) and a public/private key pair from the Market Manager. 
For every entity, a public MAM channel is created with the DID as a root with the purpose to publish the public key. The private key is locally stored within the database of the entity. 

 ![keys](docs/keys.png?raw=true)

The public key of an entity can be used by others to encrypt sensitive data, that should only be accessible by the entity. This is enabled via asynchronous encryption, where messages that are encrypted with a public key can only be decrypted with the matching private key.

 ![asyncEncryption](docs/asyncEncryption.jpg?raw=true)
 
 
<!-- Pre-requisites -->
### Pre-requisites

```shell
yarn
```
<!-- Development -->
### Development

This will run the api at <http://localhost:4000>

```shell
yarn start-dev
```

<!-- API-Description -->
### API Description 

The client transmits messages to the Market Manager via a REST API. 
Depending on the type of message, the Market Manager then executes different tasks. 
One major task that the Market Manager executes for every incoming message is wrapping it up into a transaction and sending it to the Tangle. 


#### POST /config 

Receives userId, role and location in GPS coordinates according to [Industry 4.0 Semantic](#config)

* Writes configuration details to database

Returns success or failure notification

#### POST /data

Receives conversationId, access credentials for sensor data and schema of sensor data according to [Industry 4.0 Semantic](#data)

* writes access details to database 


#### POST /cfp

Receives ‘call for proposal’ according to [Industry 4.0 Semantic](#callforproposal)

* Creates a custom tag from Prefix, type of message and operationID 
* Sends transaction with custom tag to Tangle 
* creates MAM-channel and publishes call for proposal to MAM channel 
* stores MAM-channel in database under conversation-ID 

Returns success or failure notification, tag, transaction hash and MAM information

#### POST /proposal

Receives ‘proposal’ according to [Industry 4.0 Semantic](#proposal)

* Creates a custom tag from Prefix, type of message and operationID 
* Sends transaction with custom tag to Tangle

Returns success or failure notification, tag and transaction hash

#### POST /acceptProposal

Receives ‘acceptProposal’ according to [Industry 4.0 Semantic](#acceptproposal)

* Creates a custom tag from Prefix, type of message and operationID 
* Publishes acceptProposal to MAM-channel 
* Sends transaction with custom tag  to Tangle 

Returns success or failure notification, tag, transaction hash and MAM information 


#### POST /rejectProposal

Receives ‘rejectProposal’  according to [Industry 4.0 Semantic](#rejectproposal)

* Creates a custom tag from Prefix, type of message and operationID 
* Sends transaction with custom tag to Tangle

Returns success or failure notification, tag and transaction hash


#### POST /informConfirm

Receives ‘informConfirm’ according to [Industry 4.0 Semantic](#informconfirm)

* Creates a custom tag from Prefix, type of message and operationID 
* Publishes informConfirm to MAM-channel 
* Retrieves wallet address from database 
* Adds wallet address to payload of transaction
* Sends transaction with custom tag to Tangle

* in case of sensor data request, retrieves access credentials and appends them to the
  payload before sending the transaction 

Returns success or failure notification, tag and transaction hash


#### POST /informPayment

Receives ‘informPayment’ according to [Industry 4.0 Semantic](#informpayment)

* processes payment 
* Creates a custom tag from Prefix, type of message and operationID 
* Publishes informPayment to MAM-channel 
* Sends transaction with custom tag to Tangle

Returns success or failure notification, tag and transaction hash and MAM information


#### GET /user

* Generates public/private key pair if not in DB 
* creates public MAM channel with DID as root
* publishes public key as message to public MAM channel
* saves private key under DID in DB 

Returns userId, role, location, wallet address and wallet balance


#### GET /mam/{conversationId}

Returns MAM channel content 

### Making API Requests 
Axios is an open source library for making HTTP requests and can therefore be used to send messages to the Market Manager. 

#### Pre-requisite

```shell 
npm install axios --save
```

#### Usage

```shell 
import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

const params =
{
    "userId": "User1",
    "role": "SR",
    "gps": "52.508,13.37789999999",
    "wallet": false
}

const configuration = async (params) => {
    const response = await axios.post(`${BASE_URL}/config`, params);
    console.log(response.data);
}

configuration(params);
```

### Websocket connection 

Another major task of the Market Manager is to transmit relevant SeMarket Messages from the Tangle to the Client. Therefore, the Market Manager needs to build up a persistant connection to the ZMQ node, which fetches all incoming transactions from the Tangle. Since the REST API is in first place not suitable for a persistant connection, websockets are used to tackle this task. 
After the Market Manager receives all incoming SeMarket transactions from the ZMQ, it filters only relevant ones for the client by matching its configuration with the content of the messages provided with the [Semantic I4.0 Language](#industry-4.0-language).
The implemented websockets are based on socket-io and therefore a [socket-io-client](https://github.com/socketio/socket.io-client) is required from the client side. 


#### Connect to server 

```javascript
const socket = require('socket.io-client')('http://localhost:4000');

socket.on('connect', () => {
    console.log("Connected")
});
```

#### Subscribe to messages from Market Manager


```javascript
socket.emit('subscribe', { events: ['tx'] })
```
#### Receive Data from the Market Manager

```javascript
socket.on('zmq', (data) => {
    console.log('Received message from Market Manager:', data)
});

```
#### Unsubscribe to messages from Market Manager

```javascript
socket.emit('unsubscribe', { subscriptionIds: ['subscriptionId'] } )
```

### MQTT Interface 

As an alternative to the websocket connection, the Market Manager also offers a MQTT Interface. 
For this, a HelperClient is created, which connects to the websockets and publishes the messages via MQTT.
The MQTT Interface has to be activated via an API call. 


#### POST /mqtt 

#### Payload to subscribe: 

```sh
{
    "message": "subscribe"
}
```
This returns a success or failure notification and a subscriptionID
The subscriptionID is used as a topic to publish all messages that belong to the client that received the subscriptionID.
To unsubscribe to the messages another API call is required: 

#### POST /mqtt 

#### Payload to unsubscribe:

 ```sh
{
    "message": "unsubscribe",
    "subscriptionId": "5742a685-657b-4b94-a704-36e00bc46a5a"
}
```
Returns success or failure notification 




### Filter Configuration 
As mentioned above, the Market Manager filters only messages that are relevant to the client.
To do so, there are several parameters within the [config.json](https://github.com/iotaledger/SeMarket/blob/master/ServiceApp/server/src/config.json) that can be altered in order to expand/minimize the messages that are received: 

#### maxDistance
Maximum distance, that a user accepts to a location of a sender of an incoming message. 
Values are interpreted as kilometers. 

#### operations 
List of ecl@ss IRDIS, that the user is interested in either to provide a service or to receive a service. 
Last 4 digits, that refer to the version identifier of the service are not relevant and can be ignored.

#### dataRequest
List of ecl@ss IRDIS, that the user wants to get sensor data from. 
Last 4 digits, that refer to the version identifier of the service are not relevant and can be ignored.

<!-- Industry-4.0-Semantic -->

### Industry 4.0 Semantic
Payload according to the Industry 4.0 Language can be created with the [SeMarket Industry 4.0 Language Library](https://github.com/iotaledger/SeMarket/tree/master/Industry_4.0_language#get-operations)


#### config 

```json
{
    "userId": "User2",
    "role": "SP",
    "gps": "52.508,13.37789999999",
    "wallet": true
}
```


#### data 
For example for Data from the [IOTA Data Marketplace](https://data.iota.org/#/)

```json
{
        "conversationId": "68175af8-8826-49f6-8953-5749fc0a45bd",
        "deviceId": "WeatherStation",
        "userId": "bswJqRiy5ngfih3PyOmdGxC9a7u1",
        "schema": [{
            "id": "temp",
            "name": "Temperature",
            "unit": "C"
        }]
```

#### callForProposal 
Please complete with [submodelElements](#submodelelements)

```json
{
  "frame": {
    "semanticProtocol": "http://www.vdi.de/gma720/vdi2193_2/bidding",
    "type": "callForProposal",
    "conversationId": "68175af8-8826-49f6-8953-5749fc0a45bd",
    "messageId": "1",
    "sender": {
      "identification": {
        "id": "did:iota:UYARPMVEZTA9CZHITEWRWYZDFLWG9LCUH9CRHVLHRGGTQCJOYDJFBBDRNJC9GCZGAUSNIRVTPAYSRMQQA"
      }
    },
    "replyBy": 1704063600000,
    "location": "52.508,13.37789999999",
    "startTimestamp": 1564476317000,
    "endTimestamp": 1564562717000,
    "creationDate": "29 July, 2019 10:45 am "
  },
  "dataElements": {
    "submodels": [
      {
        "identification": {
          "id": "0173-1#02-BAF577#004",
          "submodelElements": ["INSERT SUBMODELELEMENTS HERE"]
        }
      }
    ]
  }
}
```


#### proposal 

Please complete with [submodelElements](#submodelelements)

```json
{
  "frame": {
    "semanticProtocol": "http://www.vdi.de/gma720/vdi2193_2/bidding",
    "type": "proposal",
    "conversationId": "68175af8-8826-49f6-8953-5749fc0a45bd",
    "messageId": "2",
    "sender": {
      "identification": {
        "id": "did:iota:YKQCDNLHAKDNSHQVYHVWCEOSSQZJSJTSLJJEVGSXDBIZVFCQPJUWHBEZWJEDMCHESWWBYSEZ9C9SRQBOQ"
      }
    },
    "receiver":{
        "identification":{
           "id":"did:iota:UYARPMVEZTA9CZHITEWRWYZDFLWG9LCUH9CRHVLHRGGTQCJOYDJFBBDRNJC9GCZGAUSNIRVTPAYSRMQQA"
        }
     },
    "replyBy": 1704063600000,
    "location": "52.508,13.37789999999",
    "startTimestamp": 1564476317000,
    "endTimestamp": 1564562717000,
    "creationDate": "29 July, 2019 10:46 am "
  },
  "dataElements": {
    "submodels": [
      {
        "identification": {
          "id": "0173-1#02-BAF577#004",
          "submodelElements": ["INSERT SUBMODELELEMENTS HERE"]
        }
      }
    ]
  }
}
```


#### acceptProposal 

Please complete with [submodelElements](#submodelelements)

```json
{
  "frame": {
    "semanticProtocol": "http://www.vdi.de/gma720/vdi2193_2/bidding",
    "type": "acceptProposal",
    "conversationId": "68175af8-8826-49f6-8953-5749fc0a45bd",
    "messageId": "3",
    "sender": {
      "identification": {
        "id": "did:iota:UYARPMVEZTA9CZHITEWRWYZDFLWG9LCUH9CRHVLHRGGTQCJOYDJFBBDRNJC9GCZGAUSNIRVTPAYSRMQQA"
      }
    },
         "receiver": {
      "identification": {
        "id": "did:iota:YKQCDNLHAKDNSHQVYHVWCEOSSQZJSJTSLJJEVGSXDBIZVFCQPJUWHBEZWJEDMCHESWWBYSEZ9C9SRQBOQ"
      }
    },
    "replyBy": 1704063600000,
    "location": "52.508,13.37789999999",
    "startTimestamp": 1564476317000,
    "endTimestamp": 1564562717000,
    "creationDate": "29 July, 2019 10:48 am "
  },
  "dataElements": {
    "submodels": [
      {
        "identification": {
          "id": "0173-1#02-BAF577#004",
          "submodelElements": ["INSERT SUBMODELELEMENTS HERE"]
        }
      }
    ]
  }
}

```

#### rejectProposal 

Please complete with [submodelElements](#submodelelements)

```json
{
  "frame": {
    "semanticProtocol": "http://www.vdi.de/gma720/vdi2193_2/bidding",
    "type": "rejectProposal",
    "conversationId": "68175af8-8826-49f6-8953-5749fc0a45bd",
    "messageId": "3",
    "sender": {
      "identification": {
        "id": "did:iota:UYARPMVEZTA9CZHITEWRWYZDFLWG9LCUH9CRHVLHRGGTQCJOYDJFBBDRNJC9GCZGAUSNIRVTPAYSRMQQA"
      }
    },
         "receiver": {
      "identification": {
        "id": "did:iota:YKQCDNLHAKDNSHQVYHVWCEOSSQZJSJTSLJJEVGSXDBIZVFCQPJUWHBEZWJEDMCHESWWBYSEZ9C9SRQBOQ"
      }
    },
    "replyBy": 1704063600000,
    "location": "52.508,13.37789999999",
    "startTimestamp": 1564476317000,
    "endTimestamp": 1564562717000,
    "creationDate": "29 July, 2019 10:48 am "
  },
  "dataElements": {
    "submodels": [
      {
        "identification": {
          "id": "0173-1#02-BAF577#004",
          "submodelElements": ["INSERT SUBMODELELEMENTS HERE"]
        }
      }
    ]
  }
}

```

#### informConfirm 

Please complete with [submodelElements](#submodelelements)

```json
{
  "frame": {
    "semanticProtocol": "http://www.vdi.de/gma720/vdi2193_2/bidding",
    "type": "informConfirm",
    "conversationId": "68175af8-8826-49f6-8953-5749fc0a45bd",
    "messageId": "4",
    "sender": {
      "identification": {
        "id": "did:iota:YKQCDNLHAKDNSHQVYHVWCEOSSQZJSJTSLJJEVGSXDBIZVFCQPJUWHBEZWJEDMCHESWWBYSEZ9C9SRQBOQ"
      }
    },
         "receiver": {
      "identification": {
        "id": "did:iota:UYARPMVEZTA9CZHITEWRWYZDFLWG9LCUH9CRHVLHRGGTQCJOYDJFBBDRNJC9GCZGAUSNIRVTPAYSRMQQA"
      }
    },
    "replyBy": 1704063600000,
    "location": "52.508,13.37789999999",
    "startTimestamp": 1564476317000,
    "endTimestamp": 1564562717000,
    "creationDate": "29 July, 2019 10:55 am "
  },
  "dataElements": {
    "submodels": [
      {
        "identification": {
          "id": "0173-1#02-BAF577#004",
          "submodelElements": ["INSERT SUBMODELELEMENTS HERE"]
        }
      }
    ]
  }
}
```

#### informPayment

Please complete with [submodelElements](#submodelelements)

```json
{
  "frame": {
    "semanticProtocol": "http://www.vdi.de/gma720/vdi2193_2/bidding",
    "type": "informPayment",
    "conversationId": "68175af8-8826-49f6-8953-5749fc0a45bd",
    "messageId": "5",
    "sender": {
      "identification": {
        "id": "did:iota:UYARPMVEZTA9CZHITEWRWYZDFLWG9LCUH9CRHVLHRGGTQCJOYDJFBBDRNJC9GCZGAUSNIRVTPAYSRMQQA"
      }
    },
         "receiver": {
      "identification": {
        "id":"did:iota:YKQCDNLHAKDNSHQVYHVWCEOSSQZJSJTSLJJEVGSXDBIZVFCQPJUWHBEZWJEDMCHESWWBYSEZ9C9SRQBOQ"
      }
    },
    "replyBy": 1704063600000,
    "location": "52.508,13.37789999999",
    "startTimestamp": 1564476317000,
    "endTimestamp": 1564562717000,
    "creationDate": "29 July, 2019 10:58 am "
  },
  "dataElements": {
    "submodels": [
      {
        "identification": {
          "id": "0173-1#02-BAF577#004",
          "submodelElements": ["INSERT SUBMODELELEMENTS HERE"]
        }
      }
    ]
  }
}
```

#### submodelElements


```json
{
                        "idShort": "gewicht",
                        "modelType": "Property",
                        "value": "5",
                        "valueType": "string",
                        "semanticId": "0173-1#02-AAB713#005"
                      },
                      {
                        "idShort": "farbe",
                        "modelType": "Property",
                        "value": "schwarz",
                        "valueType": "string",
                        "semanticId": "0173-1#02-AAN521#005"
                      },
                      {
                        "idShort": "material",
                        "modelType": "Property",
                        "value": "stahl",
                        "valueType": "string",
                        "semanticId": "0173-1#02-BAF634#008"
                      },
                      {
                        "idShort": "ort",
                        "modelType": "Property",
                        "value": "berlin",
                        "valueType": "string",
                        "semanticId": "0173-1#02-BAF163#002"
                      },
                      {
                        "idShort": "zeit",
                        "modelType": "Property",
                        "value": "1558461600",
                        "valueType": "string",
                        "semanticId": "0173-1#02-AAO738#001"
                      },
                      {
                        "idShort": "preis",
                        "modelType": "Property",
                        "value": "5",
                        "valueType": "string",
                        "semanticId": "0173-1#02-AAO738#001"
                      }
```
