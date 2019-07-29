# IOTA MarketManager

<!-- TABLE OF CONTENTS -->
## Table of Contents 
* [About the Project]()
* [Prerequisites](#pre-requisites)
* [Development](#development)
* [API Description](#api-description)
* [Websocket Connection](#websocket-connection)
* [Industry 4.0 Semantic](#industry-4.0-semantic)
 
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


#### POST /config 

Receives userId, role and location in GPS coordinates or IOTA areaCode according to [Industry 4.0 Semantic](#config)

* Converts passed GPS coordinates to IOTA Area Codes 
* Writes configuration details to database

Returns success or failure notification

#### POST /data


#### POST /cfp

Receives ‘call for proposal’ according to [Industry 4.0 Semantic](#callforproposal)

* Creates a custom tag from type of message, operationID and location 
* Sends transaction with custom tag to Tangle 
* creates MAM-channel and publishes call for proposal to MAM channel 
* stores MAM-channel in database under conversation-ID 

Returns success or failure notification,  tag, transaction hash and MAM information

#### POST /proposal

Receives ‘proposal’ according to [Industry 4.0 Semantic](#proposal)

* Creates a custom tag from type of message, operationID and location 
* Sends transaction with custom tag to Tangle

Returns success or failure notification, tag and transaction hash

#### POST /acceptProposal

Receives ‘acceptProposal’ according to [Industry 4.0 Semantic](#acceptproposal)

* Creates a custom tag from type of message, operationID and location 
* Publishes acceptProposal to MAM-channel 
* Sends transaction with custom tag  to Tangle 

Returns success or failure notification, tag, transaction hash and MAM information 


#### POST /rejectProposal

Receives ‘rejectProposal’  according to [Industry 4.0 Semantic](#rejectproposal)

* Creates a custom tag from type of message, operationID and location 
* Sends transaction with custom tag to Tangle

Returns success or failure notification, tag and transaction hash


#### POST /informConfirm

Receives ‘informConfirm’ according to [Industry 4.0 Semantic](#informconfirm)

* Creates a custom tag from type of message, operationID and location 
* Publishes informConfirm to MAM-channel 
* Retrieves wallet address from database 
* Adds wallet address to payload of transaction
* Sends transaction with custom tag to Tangle

Returns success or failure notification, tag and transaction hash


#### POST /informPayment

Receives ‘informPayment’ according to [Industry 4.0 Semantic](#informpayment)

* processes payment 
* Creates a custom tag from type of message, operationID and location 
* Publishes informPayment to MAM-channel 
* Sends transaction with custom tag to Tangle

Returns success or failure notification, tag and transaction hash and MAM information


#### GET /user 

returns userId, role, location, wallet address and wallet balance


#### GET /mam

payload conversationid?
returns mam channel



### Websocket connection 

Market Manager transmits incoming messages that are relevant to the user 
via [socket-io-client](https://github.com/socketio/socket.io-client) connection 


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


<!-- Industry-4.0-Semantic -->

### Industry 4.0 Semantic
Payload according to the Industry 4.0 Language can be created with the [SeMarket Industry 4.0 Language Library](https://github.com/iotaledger/SeMarket/tree/master/Industry_4.0_language#get-operations)



#### Config 
```json
{
    "userId": "User1",
    "role": "SR",
    "areaCode": "NPHTQORL9XK"
}
```
OR 

```json
{
    "userId": "User1",
    "role": "SR",
    "gps": "52.508,13.37789999999"
}
```


#### CallForProposal 


```shell
{
  "frame": {
    "semanticProtocol": "http://www.vdi.de/gma720/vdi2193_2/bidding",
    "type": "callForProposal",
    "conversationId": "68175af8-8826-49f6-8953-5749fc0a45bd",
    "messageId": "1",
    "sender": {
      "identification": {
        "id": "UserSR"
      }
    },
    "replyBy": 1564390525000,
    "location": "NPHTPOYO9JQ",
    "startTimestamp": 1564476317000,
    "endTimestamp": 1564562717000,
    "creationDate": "29 July, 2019 10:45 am "
  },
  "dataElements": {
    "submodels": [
      {
        "identification": {
          "id": "0173-1#02-BAF577#004",
          "submodelElements": [ [...](#submodelElements) ]
        }
      }
    ]
  }
}
```


#### Proposal 


```json
{
  "frame": {
    "semanticProtocol": "http://www.vdi.de/gma720/vdi2193_2/bidding",
    "type": "proposal",
    "conversationId": "68175af8-8826-49f6-8953-5749fc0a45bd",
    "messageId": "2",
    "sender": {
      "identification": {
        "id": "UserSP"
      }
    },
    "replyBy": 1564390525000,
    "location": "NPHTPOYO9JQ",
    "startTimestamp": 1564476317000,
    "endTimestamp": 1564562717000,
    "creationDate": "29 July, 2019 10:46 am "
  },
  "dataElements": {
    "submodels": [
      {
        "identification": {
          "id": "0173-1#02-BAF577#004",
          "submodelElements": [[...](#submodelElements)]
        }
      }
    ]
  }
}
```


#### acceptProposal 


```json
{
  "frame": {
    "semanticProtocol": "http://www.vdi.de/gma720/vdi2193_2/bidding",
    "type": "acceptProposal",
    "conversationId": "68175af8-8826-49f6-8953-5749fc0a45bd",
    "messageId": "3",
    "sender": {
      "identification": {
        "id": "UserSR"
      }
    },
         "receiver": {
      "identification": {
        "id": "UserSP"
      }
    },
    "replyBy": 1564390525000,
    "location": "NPHTPOYO9JQ",
    "startTimestamp": 1564476317000,
    "endTimestamp": 1564562717000,
    "creationDate": "29 July, 2019 10:48 am "
  },
  "dataElements": {
    "submodels": [
      {
        "identification": {
          "id": "0173-1#02-BAF577#004",
          "submodelElements": [[...](#submodelElements)]
        }
      }
    ]
  }
}

```

#### RejectProposal 


```json
{
  "frame": {
    "semanticProtocol": "http://www.vdi.de/gma720/vdi2193_2/bidding",
    "type": "rejectProposal",
    "conversationId": "68175af8-8826-49f6-8953-5749fc0a45bd",
    "messageId": "3",
    "sender": {
      "identification": {
        "id": "UserSR"
      }
    },
         "receiver": {
      "identification": {
        "id": "UserSP"
      }
    },
    "replyBy": 1564390525000,
    "location": "NPHTPOYO9JQ",
    "startTimestamp": 1564476317000,
    "endTimestamp": 1564562717000,
    "creationDate": "29 July, 2019 10:48 am "
  },
  "dataElements": {
    "submodels": [
      {
        "identification": {
          "id": "0173-1#02-BAF577#004",
          "submodelElements": [[...](#submodelElements)]
        }
      }
    ]
  }
}

```

#### informConfirm 


```json
{
  "frame": {
    "semanticProtocol": "http://www.vdi.de/gma720/vdi2193_2/bidding",
    "type": "informConfirm",
    "conversationId": "68175af8-8826-49f6-8953-5749fc0a45bd",
    "messageId": "4",
    "sender": {
      "identification": {
        "id": "UserSP"
      }
    },
         "receiver": {
      "identification": {
        "id": "UserSR"
      }
    },
    "replyBy": 1564390525000,
    "location": "NPHTPOYO9JQ",
    "startTimestamp": 1564476317000,
    "endTimestamp": 1564562717000,
    "creationDate": "29 July, 2019 10:55 am "
  },
  "dataElements": {
    "submodels": [
      {
        "identification": {
          "id": "0173-1#02-BAF577#004",
          "submodelElements": [[...](#submodelElements)]
        }
      }
    ]
  },
"walletAddress": "SSMP99ECJBTITUDWHTHYZAYTYCIIIEMEWIPNEMWEKWBNXQJWTCVFHHXPQFMAHJJSLYPYTDIGPNIHPHJLZNGEPFI99D"
}
```

#### informPayment

```json
{
  "frame": {
    "semanticProtocol": "http://www.vdi.de/gma720/vdi2193_2/bidding",
    "type": "informPayment",
    "conversationId": "68175af8-8826-49f6-8953-5749fc0a45bd",
    "messageId": "5",
    "sender": {
      "identification": {
        "id": "UserSR"
      }
    },
         "receiver": {
      "identification": {
        "id": "UserSP"
      }
    },
    "replyBy": 1564390525000,
    "location": "NPHTPOYO9JQ",
    "startTimestamp": 1564476317000,
    "endTimestamp": 1564562717000,
    "creationDate": "29 July, 2019 10:58 am "
  },
  "dataElements": {
    "submodels": [
      {
        "identification": {
          "id": "0173-1#02-BAF577#004",
          "submodelElements": [ [...](#submodelElements)]
  },
"walletAddress": "SSMP99ECJBTITUDWHTHYZAYTYCIIIEMEWIPNEMWEKWBNXQJWTCVFHHXPQFMAHJJSLYPYTDIGPNIHPHJLZNGEPFI99D"
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
            }
```





## Helpers

This project contains a number of helper functions to facilitate operations like proposal propagation, payment for services and managing user and wallet.

### Wallet Helper

#### Example getBalance operation:
```
import { getBalance } from './walletHelper';

await getBalance(address);
```

#### Example payment operation:
```
import { processPayment } from './walletHelper';

const transactions = await processPayment(address, amount);
if (transactions.length > 0) {
    console.log('Success');
}
```

### MAM Helper

#### Example write operation:
```
import uuid from 'uuid/v4';
import { publish } from './mamHelper';

const channelId = uuid();

await publish(channelId, { message: 'Message from Alice' });
await publish(channelId, { message: 'Message from Bob' });
```

#### Example read operation:
```
import { fetchFromChannelId } from './mamHelper';
import { readData } from './databaseHelper';

const fetchData = async channelId => {
    const messages = await fetchFromChannelId(channelId);
    messages.forEach(message => console.log(message));
}
```

### Local Database Helper

#### Example write operation
```
import { writeData } from './databaseHelper';

const data = {
    address: 'CCCCCDDDDD',
    seed: 'SSSSSSEEEEDDDD',
    amount: 555
};

await writeData(table_name, data);
```

#### Example read operation
```
import { readData } from './databaseHelper';

const result = await readData(table_name, [search_field]);
if (result) {
    return result;
}
```

#### Example delete operation:
```
import { removeData } from './databaseHelper';

await removeData(table_name);
```

### User Helper

Please perform these operations from the project root folder

#### Create new user:

1. Build project (if not done already)
2. Run `new-user` script and provide user role (SR or SP) and unique user ID
   
```
yarn server-build

yarn new-user SR user-1234567 NPHTQORL9XK
```

#### Create and fund a new wallet:

1. Build project (if not done already)
2. Run `new-wallet` script. No additional parameters are needed. This operation may take up to 3 minutes, please do not interrupt it. 
  
```
yarn server-build

yarn new-wallet
```
