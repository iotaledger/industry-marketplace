# IOTA Industry Marketplace Simulator
 
<!-- Pre-requisites -->
### About the Project
 ![architecture](docs/architecture.png?raw=true)

<!-- Pre-requisites -->
### Pre-requisites

* regular pre-requisites for the Industry Marketplace
* Create as many users as required for the simulator all with one role 
* Create as many wallets as required for the wallet queue

<!-- Development -->
### Development
Activate Simulator from ServiceApp folder with 

```shell
yarn simulate SR 
```

or 

```shell
yarn simulate SP
```
### Wallet Queue

Wallets can have 4 statuses: 

* 'reserved': wallet reserved for incoming payment 
* 'busy': wallets involved in payment process
* 'usable': wallets available for payment processes
* 'error': wallet with an error or wallet that gets repaired 

Only 'usable' wallets can be used for payments. After successful payment wallets are reset to 'usable'. 
In case of a balance of 0 of an Address, a walletRepair function checks if the balance can be found at a different index 
