import axios from "axios";
import { identityAuthenticationEndpoint, trustedIdentities } from "../config.json"
import dotenv from "dotenv";
import { VERIFICATION_LEVEL } from "./credentialHelper";
import { removeDataWhere } from "./databaseHelper";

dotenv.config({ path: __dirname + '/../../../.env' }); // Only needed if we eventually have an API Key for this service too

const proveOwnershipEndpoint = "/api/v1/ownership/prove";

export interface IVerificationRequest {
    did: string;
    timestamp: number;
    signature: string;
}
VERIFICATION_LEVEL
export const proveOwnership = async (verificationRequestObject: IVerificationRequest): Promise<VERIFICATION_LEVEL> => {
    return new Promise<VERIFICATION_LEVEL>(async (resolve, reject) => {
        try {
            //data = null if there is no metadata, however, decided to just include the user data in the identity?
            
            await axios.post("http://localhost:2000/api/v1/ownership/prove", verificationRequestObject)
                .then(returnObject => {
                    console.log(returnObject);
                    let verificationLevel: VERIFICATION_LEVEL = VERIFICATION_LEVEL.UNVERIFIED;
                    if (returnObject?.data.success) {
                        if (returnObject.data.isVerified) {
                            if (trustedIdentities.includes(verificationRequestObject.did)) {
                                //id is set as a trusted identity in the config file 
                                verificationLevel = VERIFICATION_LEVEL.DID_TRUSTED;
                            }
                            else {
                                verificationLevel = VERIFICATION_LEVEL.DID_OWNER;
                            }
                        }
                        resolve(verificationLevel);
                    }

                    else {
                        //TODO: Should I reject or throw error here?
                        reject(returnObject.data.error);
                    }
                })
                .catch((error) => {
                    console.log(error)
                    resolve(VERIFICATION_LEVEL.UNVERIFIED);
                })
                .finally(() => {
                    removeDataWhere('trustedDIDAuthentication', `id = '${verificationRequestObject.did}'`)
                });

        } catch (error) {
            reject(error);
        }
    });
}