const io = require('socket.io-client');
var socket = io.connect("http://localhost:3000");
    

////////////////////////////////////////////////////////////////////////

//         THE CODE IS ALL THE WAY ON THE BOTTOM OF THIS FILE        //

//////////////////////////////////////////////////////////////////////

// JSON strings received from Asset Administration Shell in future

var cfp = {
    "frame": {
        "semanticProtocol": "http://www.vdi.de/gma720/vdi2193_2/bidding",
        "type": "callForProposal",
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

var proposal = {
    "frame": {
    "semanticProtocol":
    "http://www.vdi.de/gma720/vdi2193_2/bidding",
    "type": "proposal",
    "conversationId": "68175af8-8826-49f6-8953-5749fc0a45bd",
    "messageId": "2",
    "sender": {
    "identification": {
    "id": "http://www.admin-shell.io/wewash/sp1"
    }
    },
    "receiver": {
    "identification": {
    "id": "http://www.admin-shell.io/wewash/sr1"
    }
    },
    "replyBy": "1558451700"
    },
    "dataElements": {
    "submodels": [{
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
    },
    {
    "idShort": "preis",
    "modelType": "Property",
    "value": "5",
    "valueType": "string",
    "semanticId": "0173-1#02-AAO739#001"
    }
    ]
    }
    }
    ]
    }}
    var rejectProposal = {
        "frame": {
        "semanticProtocol":
        "http://www.vdi.de/gma720/vdi2193_2/bidding",
        "type": "rejectProposal",
        "conversationId": "68175af8-8826-49f6-8953-5749fc0a45bd",
        "messageId": "3",
        "sender": {
        "identification": {
        "id": "http://www.admin-shell.io/wewash/sr1"
        }
        },
        "receiver": {
        "identification": {
        "id": "http://www.admin-shell.io/wewash/sp1"
        }
        }
        },
        "dataElements": {
        "submodels": [{
        "identification": {
        "id": "0173-1#02-BAF577#004"
        }
        }
        ]
        }
        }
        var acceptProposal = {
            "frame": {
            "semanticProtocol":
            "http://www.vdi.de/gma720/vdi2193_2/bidding",
            "type": "acceptProposal",
            "conversationId": "68175af8-8826-49f6-8953-5749fc0a45bd",
            "messageId": "5",
            "sender": {
            "identification": {
            "id": "http://www.admin-shell.io/wewash/sr1"
            }
            },
            "receiver": {
            "identification": {
            "id": "http://www.admin-shell.io/wewash/sp1"
            }
            },
            "replyBy": "1558451700"
            },
            "dataElements": {
            "submodels": [{
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
            },
            {
            "idShort": "preis",
            "modelType": "Property",
            "value": "5",
            "valueType": "string",
            "semanticId": "0173-1#02-AAO739#001"
            }
            ]
            }
            }
            ]
            }
            }

            var informConfirm = {
                "frame": {
                "semanticProtocol":
                "http://www.vdi.de/gma720/vdi2193_2/bidding",
                "type": "informConfirm",
                "conversationId": "68175af8-8826-49f6-8953-5749fc0a45bd",
                "messageId": "3",
                "sender": {
                "identification": {
                "id": "http://www.admin-shell.io/wewash/sp1"
                }
                },
                "receiver": {
                "identification": {
                "id": "http://www.admin-shell.io/wewash/sr1"
                }
                },
                "replyBy": "1558451700"
                },
                "dataElements": {
                "submodels": [{
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
                },
                {
                "idShort": "preis",
                "modelType": "Property",
                "value": "5",
                "valueType": "string",
                "semanticId": "0173-1#02-AAO739#001"
                }
                ]
                }
                }
                ]
                }}
      
// Configuration of client
// ServiceID just needed for Service Provider 
// For Service Requestor it's already in the CFP JSON string 
             
var role = "SP"
var serviceID =  "0173-1#02-BAF577#004"

socket.emit('config', role)

// Configure Interface either for SR or SP 

if (role === "SR"){
    console.log("Interface konfiguriert MaMa als SR")

    //send cfp
    socket.emit('cfp', cfp)
}

else {
    console.log("Interface konfiguriert MaMa als SP")
    //send serviceID 
    socket.emit('serviceID', serviceID)

    //Listen to cfp for service that client can provide 
    socket.on('cfp', (data)  => {
    console.log("OUTPUT UI: "),
    console.log("There is a call for proposal for you"),
    console.log(data)
    //socket.emit('proposal', proposal)
})


}
