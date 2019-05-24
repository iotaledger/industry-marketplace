// Require the IOTA libraries
const Iota = require('@iota/core');
const Converter = require('@iota/converter');
// Create a new instance of the IOTA object
// Use the `provider` field to specify which IRI node to connect to
const iota = Iota.composeAPI({
provider: 'https://nodes.devnet.iota.org:443'
});

//Create seed from terminal
//Linux: cat /dev/urandom |tr -dc A-Z9|head -c${1:-81}
//Let this run through once and catch first Address
// insert public adress into https://faucet.devnet.iota.org/ to get iota tokens

const seed = "GXJ9NZBEYLNBIKIURJFCSYOATERR9TFCZTHHRICRESIHPSLRIZAZUGNHTCVDZSLO9ZSKTITCRJRWWZTLB"

    iota.getNewAddress(seed, {'returnAll':true})
        .then(allAddresses => {
                console.log(allAddresses)
                return  iota.getBalances(allAddresses, 10)
        })
        .then( balances => {
                console.log(balances)
        })
  .catch(err => {
           
        // Catch any errors
            console.log(err);
        });
        
