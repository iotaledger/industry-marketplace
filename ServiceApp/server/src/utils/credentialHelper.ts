import { readData, createCredential } from "./databaseHelper";
import { RSAKeypair, ProofParameters, VerificationErrorCodes, DecodeProofDocument, VerifiableCredential, VerifiableCredentialDataModel } from "identity_ts";
import { decryptCipher } from "./encryptionHelper";


export async function ProcessReceivedCredentialForUser(unstructuredData : any, provider : string) {
    //Filter out incorrectly structured transactions
    if(!unstructuredData["key"] || !unstructuredData["iv"] || !unstructuredData["data"]) {
        return;
    }
    const data : { key : string, iv : string, data : string } = unstructuredData;

    //Get pieces for decryption
    const did : any = await readData('did');
    const encryptionKeypair = new RSAKeypair(null, did.privateKey);
    data.key = await encryptionKeypair.PrivateDecrypt(Buffer.from(data.key, "hex"));
    const credentialString = decryptCipher({key : Buffer.from(data.key, "hex"), iv: Buffer.from(data.iv, "hex"), encoded : Buffer.from(data.data, "hex")}).toString("utf8");

    //Verify the credential is valid and for this user
    try{
        const credentialJSON = JSON.parse(credentialString);
        const credentialFormat = <VerifiableCredentialDataModel>credentialJSON;
        
        let proofParameters : ProofParameters = await DecodeProofDocument(credentialFormat.proof, provider);
        let importVerifiableCredential : VerifiableCredential = await VerifiableCredential.DecodeFromJSON(credentialFormat, proofParameters);
        const user : any = await readData('user');
        const verificationResult = importVerifiableCredential.Verify();
        if(importVerifiableCredential.EncodeToJSON().credentialSubject["DID"] == user.id && verificationResult == VerificationErrorCodes.SUCCES) {
            //Store the credential in the DB, sorted under the DID of the Issuer
            await createCredential({ id: credentialFormat.proof.creator, credential : credentialString});
        } else {
            console.log("Credential Target: ", importVerifiableCredential.EncodeToJSON().credentialSubject["DID"]);
            console.log("VerificationResult: ", verificationResult);
        }
        
    } catch(e) {
        console.log("Credential Verification Error: ", e);
    }
}