# Industry Marketplace Testing Environment

### Description

This IOTA Industry Marketplace Testing Environment will let you test your application on a private Industry Marketplace instance running on a Private Tangle. Within the testing environment, you can either connect to one of the provided MarketManagers or join with your own MarketManager instance. Two simulation instances imitate ongoing bidding processes.


### Clone

```sh
git clone --branch simulation-w/o-walletqueue https://github.com/iotaledger/industry-marketplace.git
cd industry-marketplace/
git clone https://github.com/iota-community/one-command-tangle.git
```

### Set up and run

```sh
bash ./industry-marketplace/IMP_Setup_Environment.sh
```

This will set up the Private Tangle as well as the Testing Environment with 2 simulation instances and 2 MarketManagers to connect with. The setup might take up to 5 minutes. 

Available Connections: 

* Private Tangle: http://localhost:14265/
* MarketManager instance 1: http://localhost:4300/
* MarketManager instance 2:http://localhost:5300/


To create a user and wallet for the provided MarketManager instances please perform an API POST request to http://localhost:5300/createUser or http://localhost:4300/createUser  With the following request format:

```sh
{  
  name: testSR,
  role: SR,
  location: 52.507339,13.377982 
}  
```

For further interactions with the MarketManager please follow the directions in our [Technical documentation](https://industry.iota.org/files/Industry_Marketplace_Technical_Documentation.pdf)
 


### Restart

```sh
bash ./industry-marketplace/IMP_Run_Environment.sh
```
This avoids the creation of new users and wallets. 

Keep in mind, that the -bootstrap extra flag from the .env configuration file of the Private Tangle has to be removed before restarting the Private Tangle. For more information check out the Private Tangle [Readme](https://github.com/iota-community/one-command-tangle)



### Link Consolidation
* [Landing page](https://industrymarketplace.net)
* [One-Pager](https://industry.iota.org/files/IOTA_Industry_Marketplace.pdf)
* [Technical Documentation](Industry_Marketplace_Technical_Documentation.pdf)
* [Explainer Video](https://www.youtube.com/watch?v=Jnh_9nKkemM)
* [Use Case Examples](https://industrymarketplace.net/use_cases)
* [Demo site](https://industrymarketplace.net/demo)
* [Try as Service Requester](https://service-requester.iota-dev1.now.sh/ (keep requester window open to interact with SP))
* [Try as Service Provider](https://service-provider.iota-dev1.now.sh/  (keep requester window open to interact with SR))
* [Private Tangle](https://github.com/iota-community/one-command-tangle)
