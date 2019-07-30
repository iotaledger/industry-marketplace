# SeMarket MQTT Interface 

* Alternatively, the Market Manager can transmit incoming messages that are relevant to the user via MQTT
* The Market Manager does not offer an own MQTT Broker, it is suggested to either use an open source MQTT broker such as ‘test.mosquitto.org’ or implement an own MQTT Broker
* MQTT Option is enabled via the API 


### POST /mqtt 

#### Payload to subscribe: 

```sh
{
    "message": "subscribe"
}
```


* Creates helperClient that connects to websockets 
* HelperClient subscribes to messages from Market Manager and    publishes them under the subscriptionID as topic

Returns success or failure notification and subscriptionID



#### Payload to unsubscribe:

 ```sh
{
    "message": "unsubscribe",
    "subscriptionId": "5742a685-657b-4b94-a704-36e00bc46a5a"
}
```

* Unsubscribes to messages from Market Manager 

Returns success or failure notification 


