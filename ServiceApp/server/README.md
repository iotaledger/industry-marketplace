# IOTA MarketManager

### Pre-requisites

```shell
yarn
```

### Development

This will run the api at <http://localhost:4000>

```shell
yarn start-dev
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

await writeData(data, entry);
```

#### Example read operation
```
import { readData } from './databaseHelper';

const result = await readData(channelId);
if (result) {
    return result;
}
```

#### Example delete operation:
```
import { removeData } from './databaseHelper';

await removeData(entry);
```

### User Helper

Please perform these operations from the project root folder

#### Create new user:

1. Build project (if not done already)
2. Run `new-user` script and provide user role (SR or SP) and unique user ID
   
```
yarn server-build

yarn new-user SR user-1234567
```

#### Create and fund a new wallet:

1. Build project (if not done already)
2. Run `new-wallet` script. No additional parameters are needed. This operation may take up to 3 minutes, please do not interrupt it. 
  
```
yarn server-build

yarn new-wallet
```
