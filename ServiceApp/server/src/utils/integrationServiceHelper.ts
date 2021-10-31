import axios from "axios";
import integrationServiceEndpoint from "../config.json"


const postConfig = {
    headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
    }
};
const getConfig = {
    headers: {
        'accept': 'application/json',
    }
};

const createIdentityEndpoint = "/identities/create/";
const getProveOwnershipEndpoint = "/authentication/prove-ownership/"

export const createIdentity = async () => {

    //data = null as there is no need for any metadata 
    const result = await axios.post(integrationServiceEndpoint + createIdentityEndpoint, null, postConfig)
        .then(returnObject => {
            const documentId = returnObject.data.doc.id;
            const secretKey = returnObject.data.key.secret;
            const publicKey = returnObject.data.key.public;
            const messageId = returnObject.data.key.txHash;

            return { documentId, messageId, secretKey, publicKey }
        })

}


export const getAuthenticationToken = async (id) => {

    //data = null as there is no need for any metadata 
    await axios.get(integrationServiceEndpoint + getProveOwnershipEndpoint + id, getConfig)
        .then(async returnObject => {
            const nonce = returnObject.data.nonce;
            
            let signedNonce = null;
            //TODO: Actually sign nonce
            await axios.post(integrationServiceEndpoint + getProveOwnershipEndpoint + id , 
                {
                    "signedNonce": signedNonce
                }, postConfig)
                .then(returnObject => {
                    return returnObject.data.jwt;
                })
            
        })
        //TODO: Better to throw an error here?
        return null;
}
