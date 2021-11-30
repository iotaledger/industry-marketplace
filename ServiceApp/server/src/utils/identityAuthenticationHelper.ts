import axios from "axios";
import { identityAuthenticationEndpoint } from "../config.json"
import dotenv from "dotenv";

dotenv.config({ path: __dirname + '/../../../.env' }); // Only needed if we eventually have an API Key for this service too

const proveOwnershipEndpoint = "/api/v1/ownership/prove";

export interface IVerificationRequest {
    did: string;
    timestamp: number;
    signature: string;
}

export const proveOwnership = async (verificationRequestObject: IVerificationRequest): Promise<Boolean> => {
    return new Promise<Boolean>(async (resolve, reject) => {
        try {
            //data = null if there is no metadata, however, decided to just include the user data in the identity?
            await axios.post(identityAuthenticationEndpoint + proveOwnershipEndpoint, verificationRequestObject)
                .then(returnObject => {
                    console.log(returnObject);
                    if(returnObject?.data.success){
                       resolve(returnObject.data.isVerified); 
                    }
                    else{
                        reject(returnObject.data.error);
                    }
                });

        } catch (error) {
            reject(error);
        }
    });
}