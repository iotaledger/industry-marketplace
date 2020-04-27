# IOTA Industry Marketplace Simulation
 
 The Industry Marketplace Simulation provides the opportunity to simulate a Service Requester or a Service Provider Instance of the Industry Marketplace. 


<!-- Pre-requisites -->
### Set up 

```sh
git clone --branch Simulation https://github.com/iotaledger/industry-marketplace.git
cd industry-marketplace/ServiceApp/server/
yarn
```
### Configuration 

Before running the simulation, it is necessary to create users and wallets. 
It is only possible to run either a Service Requester or a Service Provider Simulation. 
However, it is possible to create multiple Users for the same role. 

Create wallets with

```sh
cd ServiceApp
yarn new-wallet
```
and users with

```sh
cd ServiceApp
yarn new-user 'SR' 'TestSR' '52.51069641113281,13.372206687927246'
```

### Run Simulation 

Start MarketManager in one terminal via 

```sh
cd ServiceApp/server/
yarn start-dev
```

Start Simulation with

```sh
cd ServiceApp/
yarn simulate SR
```

### Wallet Queue

The wallet queue is a special feature for the simulation. 
It derives from the fact that transactions might be pending for a longer time. 
During that time, it is not possible to perform further transactions from the same wallet. 

The wallet queue makes it possible to use multiple wallets. 

Wallets may have 4 statuses: 

* 'reserved': wallet reserved for incoming payments 
* 'busy': wallets involved in payment process
* 'usable': wallets available for payment processes
* 'error': wallet with an error or wallet that gets repaired 

Only 'usable' wallets can be used for payments. After successful payment wallets are reset to 'usable'. 
In case of a balance of 0 of an Address, a walletRepair function checks if the balance can be found at a different index 
