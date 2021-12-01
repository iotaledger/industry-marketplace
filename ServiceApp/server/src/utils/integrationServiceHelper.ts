import axios from "axios";
import {integrationServiceEndpoint} from "../config.json"
import dotenv from "dotenv";

dotenv.config({ path: __dirname+'/../../../.env' });

const createIdentityEndpoint = "/identities/create/";

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