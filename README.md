#  Industry Marketplace Metric

The metric collects the number of messages send via the Industry Marketplace.
(Excluding Simulation messages) 

### Clone and install 

```sh
git clone --branch metrics https://github.com/iotaledger/industry-marketplace.git
cd industry-marketplace/ServiceApp/server/
yarn 
```

### Start metric

```sh
docker-compose up
```

### Configure metric

* define port as an environment variable process.env.PORT
* define the frequency of the automatic count extraction as an environment variable process.env.FREQUENCY 
  (Note: Frequency must be given in ms)


### Fetch counts 

```sh
curl -X POST http://localhost:3000/getMetric
```

### Reset counts to zero 

```sh
curl -X POST http://localhost:3000/restartMetric
```
