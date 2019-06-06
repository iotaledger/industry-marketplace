const Iota = require('@iota/core');
const Converter = require('@iota/converter');

const iota = Iota.composeAPI({
        provider: 'https://nodes.devnet.iota.org:443'
        });
    


exports.fetchFromTangle = (data) => 

{ 
       
         //Get bundle and extract data
var bundle = data[8]

iota.findTransactionObjects({bundles: [bundle]})
        .then( transObj => { 
        
                // Modify to consumable length
                const trytes = transObj[0].signatureMessageFragment + '9'
                //Convert to text
                msg = Converter.trytesToAscii(trytes)

                console.log(typeof msg)
        })
       
        .catch(err => { 
                console.error(err) 
        })

    }
