// Require the IOTA libraries
const { composeAPI } = require('@iota/core');
const { asciiToTrytes } = require('@iota/converter');
const { generateSeed } = require('./helpers');

// Create a new instance of the IOTA object
// Use the `provider` field to specify which IRI node to connect to
const provider = 'https://altnodes.devnet.iota.org:443';
const iota = composeAPI({ provider });

function sendMessage() {
    const payload ={
      "frame": {
          "semanticProtocol": "http://www.vdi.de/gma720/vdi2193_2/bidding",
          "type": "callForProposal",
          "location": "NPHTPOYO9JQ",
          "conversationId": "68175af8-8826-49f6-8953-5749fc0a45bd",
          "messageId": "1",
          "sender": {
              "identification": {
                  "id": "http://www.admin-shell.io/wewash/sr1"
              }
          },
          "replyBy": "1558451700"
      },
      "dataElements": {
          "submodels": [
              {
                  "identification": {
                      "id": "0173-1#02-BAF577#004",
                      "submodelElements": [
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
                              "value": "baumwolle",
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
                      ]
                  }
              }
          ]
      }
  }
  const value = 0;
    const seed = generateSeed();

    const message = asciiToTrytes(JSON.stringify(payload));

    const address = 'HELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDD';

    const tag = 'SEMARKETABAFFHDNPHTQORL9XK';

    //transfer array specifies transfers you want to make
    const transfers = [{ value, address, message, tag }];

    iota.prepareTransfers(seed, transfers)
        .then(trytes => iota.sendTrytes(trytes, 3, 9))
        .then(bundle => {
            console.log(`Published transaction with tail hash: ${bundle[0].hash}`);
            console.log(`Bundle: ${JSON.stringify(bundle, null, 1)}`);
        })
        .catch(err => console.log(err));
}

sendMessage();



