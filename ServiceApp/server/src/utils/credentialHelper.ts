import { readData, createCredential } from "./databaseHelper";
import { RSAKeypair, ProofParameters, VerificationErrorCodes, DecodeProofDocument, VerifiableCredential, VerifiableCredentialDataModel, VerifiablePresentation, SignDIDAuthentication, Presentation, BuildRSAProof, DIDDocument, VerifiablePresentationDataModel, SchemaManager } from "identity_ts";
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
            console.log("Credential Stored: ", credentialString);
        } else {
            console.log("Credential Target: ", importVerifiableCredential.EncodeToJSON().credentialSubject["DID"]);
            console.log("VerificationResult: ", verificationResult);
        }
        
    } catch(e) {
        console.log("Credential Verification Error: ", e);
    }
}
//request.frame.conversationId
export async function CreateAuthenticationPresentation(conversationId : string, provider : string) : Promise<VerifiablePresentation> {
    //1.25 Sign DID Authentication
    const incomingChallenge : any = await readData('incomingChallenge', conversationId);
    const did : any = await readData('did');
    const userDIDDocument = await DIDDocument.readDIDDocument(provider, did.root);
    userDIDDocument.GetKeypair(did.keyId).GetEncryptionKeypair().SetPrivateKey(did.privateKey);
    const didAuthCredential = SignDIDAuthentication(userDIDDocument, did.keyId, incomingChallenge.challenge);

    //Add the stored Credential
    const credentialsArray : VerifiableCredential[] = [didAuthCredential];
    const whiteListCredential : any = await readData('credentials');
    if(whiteListCredential) {
        const decodedProof = await DecodeProofDocument(whiteListCredential.credential, provider);
        credentialsArray.push(VerifiableCredential.DecodeFromJSON(whiteListCredential.credential, decodedProof));
    }

    //Create the presentation
    const presentation = Presentation.Create(credentialsArray);
    const presentationProof = BuildRSAProof({issuer:userDIDDocument, issuerKeyId:"keys-1", challengeNonce:incomingChallenge.challenge});
    presentationProof.Sign(presentation.EncodeToJSON());
    return VerifiablePresentation.Create(presentation, presentationProof);
}

export enum VERIFICATION_LEVEL {
    UNVERIFIED = 0,
    DID_OWNER = 1,
    DID_TRUSTED = 2
}   

export async function VerifyCredentials(presentationData : VerifiablePresentationDataModel, conversationId : string, provider : string) : Promise<VERIFICATION_LEVEL> {
    //Create objects
    const outgoingChallenge : any = await readData('outgoingChallenge', conversationId);
    const proofParameters = await DecodeProofDocument(presentationData.proof, provider);
    const verifiablePresentation = await VerifiablePresentation.DecodeFromJSON(presentationData, provider, proofParameters);

    //Verify
    SchemaManager.GetInstance().GetSchema("DIDAuthenticationCredential").AddTrustedDID(proofParameters.issuer.GetDID());
    const code = verifiablePresentation.Verify();
    SchemaManager.GetInstance().GetSchema("DIDAuthenticationCredential").RemoveTrustedDID(proofParameters.issuer.GetDID());

    //Determine level of trust
    let verificationLevel : VERIFICATION_LEVEL = VERIFICATION_LEVEL.UNVERIFIED;
    if(code == VerificationErrorCodes.SUCCES && presentationData.proof.nonce == outgoingChallenge.challenge) {
        verificationLevel = VERIFICATION_LEVEL.DID_OWNER;
        if(verifiablePresentation.GetVerifiedTypes().includes("WhiteListedCredential")) {
            verificationLevel = VERIFICATION_LEVEL.DID_TRUSTED;
        }
    } else {
        console.log('DIDAuthenticationError', code);
        console.log('SolvedChallenge', presentationData.proof.nonce);
        console.log('RequestedChallenge', outgoingChallenge.challenge);
    }
    return verificationLevel;
}