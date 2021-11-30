import axios from "axios";
import {integrationServiceEndpoint} from "../config.json"
import dotenv from "dotenv";

dotenv.config({ path: __dirname+'/../../../.env' });

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
const proveOwnershipEndpoint = "/authentication/prove-ownership/"

export interface ICreateIdentityResult {
    documentId: string;
    messageId: string;
    secretKey: string;
    publicKey: string;
}

export const createIdentity = async (userObject): Promise<ICreateIdentityResult> => {
    return new Promise<ICreateIdentityResult>(async (resolve, reject) => {
        try {
            //data = null if there is no metadata, however, decided to just include the user data in the identity?
            console.log(integrationServiceEndpoint + createIdentityEndpoint)
            await axios.post(integrationServiceEndpoint + createIdentityEndpoint+ "?api-key=" + process.env.INTEGRATION_SERVICE_API_KEY, userObject)
                .then(returnObject => {
                    const documentId = returnObject.data.doc.id;
                    const secretKey = returnObject.data.key.secret;
                    const publicKey = returnObject.data.key.public;
                    const messageId = returnObject.data.txHash;

                    console.log(JSON.stringify(returnObject.data, null, 4));

                    resolve({ documentId, messageId, secretKey, publicKey });
                })

        } catch (error) {
            
            reject(error);
        }
    });
}


//TODO: Micheles methods
// export const getAuthenticationToken = async (id) => {

//     //data = null as there is no need for any metadata 
//     await axios.get(integrationServiceEndpoint + getProveOwnershipEndpoint + id, getConfig)
//         .then(async returnObject => {
//             const nonce = returnObject.data.nonce;

//             let signedNonce = null;
//             //TODO: Actually sign nonce
//             await axios.post(integrationServiceEndpoint + getProveOwnershipEndpoint + id , 
//                 {
//                     "signedNonce": signedNonce
//                 }, postConfig)
//                 .then(returnObject => {
//                     return returnObject.data.jwt;
//                 })

//         })
//         //TODO: Better to throw an error here?
//         return null;
// }

//TODO: Also not really needed anymore, as for now we dont intend to do the nonce-handshake with the API
// export const fetchAuth = async (identity: any) => {
// 	console.log('requesting nonce to sign...');
// 	//const apiKey = Config.apiKey ? `?api-key=${Config.apiKey}` : '';
// 	const url = `${integrationServiceEndpoint}${ProveOwnershipEndpoint}${identity.doc.id}${apiKey}`;

// 	const res = await axios.get(url);
// 	if (res.status !== 200) {
// 		console.error('didnt receive status 200 on get request for prove-ownership!');
// 		return;
// 	}
// 	const body = await res.data;
// 	const nonce: string = body.nonce;
// 	console.log('received nonce: ', nonce);

// 	const encodedKey = await getHexEncodedKey(identity.key.secret);
// 	const signedNonce = await signNonce(encodedKey, nonce);
// 	console.log('signed nonce: ', signedNonce);

// 	console.log('requesting authentication token using signed nonce...', identity.doc.id);
// 	const response = await axios.post(`${integrationServiceEndpoint}${ProveOwnershipEndpoint}${identity.doc.id}${apiKey}`, JSON.stringify({ signedNonce }),
// 		postConfig);

// 	return response; //res.data.jwt contains the JWT Token
// };