import { 
    BuildRSAProof, 
    DecodeProofDocument, 
    DIDDocument, 
    Presentation, 
    ProofParameters, 
    RSAKeypair, 
    SchemaManager, 
    SignDIDAuthentication, 
    VerifiableCredential, 
    VerifiableCredentialDataModel, 
    VerifiablePresentation, 
    VerifiablePresentationDataModel, 
    VerificationErrorCodes, 
    GenerateSeed,
    CreateRandomDID,
    GenerateRSAKeypair,
    Service,
    DIDPublisher
} from 'identity_ts';
import { createCredential, readRow, writeData } from './databaseHelper';
import { decryptCipher } from './encryptionHelper';
import { IUser } from '../models/user';

const provider = process.env.PROVIDER

export function createNewUser(name: string = '', role: string = '', location: string = ''): Promise <IUser> {
    
    return new Promise<IUser>(async (resolve, reject)=> {
        
        const seed = GenerateSeed();
        const userDIDDocument = CreateRandomDID(seed);
        const keypair = await GenerateRSAKeypair();
        const privateKey = keypair.GetPrivateKey();
        const keyId  = 'keys-1';
        const tangleComsAddress = GenerateSeed(81);
        userDIDDocument.AddKeypair(keypair, keyId);
        userDIDDocument.AddServiceEndpoint(
            new Service(
                userDIDDocument.GetDID(), 
                'tanglecom', 
                'TangleCommunicationAddress', 
                tangleComsAddress
            )
        );
        const publisher = new DIDPublisher(provider, seed);
        const root = await publisher.PublishDIDDocument(userDIDDocument, 'SEMARKET', 9);
        const state = publisher.ExportMAMChannelState();
        await writeData('did', { root, privateKey, keyId, seed, next_root: state.nextRoot , start: state.channelStart });

        // Store user
        const id = userDIDDocument.GetDID().GetDID();
        const user: IUser = { id, name, role, location, address: tangleComsAddress };
        await writeData('user', user);
        resolve(user);
    });
}

export async function ProcessReceivedCredentialForUser(unstructuredData : any, provider : string, did ) {
    //Filter out incorrectly structured transactions
    if(!unstructuredData["key"] || !unstructuredData["iv"] || !unstructuredData["data"]) {
        return;
    }
    const data : { key : string, iv : string, data : string } = unstructuredData;

    //Get pieces for decryption
   // const did : any = await readData('did');
    const encryptionKeypair = new RSAKeypair(null, did.privateKey);
    data.key = await encryptionKeypair.PrivateDecrypt(Buffer.from(data.key, "hex"));
    const credentialString = decryptCipher({key : Buffer.from(data.key, "hex"), iv: Buffer.from(data.iv, "hex"), encoded : Buffer.from(data.data, "hex")}).toString("utf8");
    //Verify the credential is valid and for this user
    try{
        const credentialJSON = JSON.parse(credentialString);
        const credentialFormat = <VerifiableCredentialDataModel>credentialJSON;
        
        let proofParameters : ProofParameters = await DecodeProofDocument(credentialFormat.proof, provider);
        let importVerifiableCredential : VerifiableCredential = await VerifiableCredential.DecodeFromJSON(credentialFormat, proofParameters);

        const verificationResult = importVerifiableCredential.Verify();
        if(importVerifiableCredential.EncodeToJSON().credentialSubject["DID"] == `did:IOTA:${did.root}` && verificationResult == VerificationErrorCodes.SUCCES) {
            //Store the credential in the DB, sorted under the DID of the Issuer
            await createCredential({ id: credentialFormat.proof.creator, credential : credentialString, did: `did:IOTA:${did.root}`});
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
export async function CreateAuthenticationPresentation(provider : string, did ) : Promise<VerifiablePresentation> {
    //1.25 Sign DID Authentication
    const challenge = Date.now().toString();
    const userDIDDocument = await DIDDocument.readDIDDocument(provider, did.root);
    userDIDDocument.GetKeypair(did.keyId).GetEncryptionKeypair().SetPrivateKey(did.privateKey);
    const didAuthCredential = SignDIDAuthentication(userDIDDocument, did.keyId, challenge);

    //Add the stored Credential
    const credentialsArray : VerifiableCredential[] = [didAuthCredential];


    const whiteListCredential : any = await readRow('credentials', 'did', `did:IOTA:${did.root}`)
    if(whiteListCredential) {
        const parsed = JSON.parse(whiteListCredential.credential);
        const decodedProof = await DecodeProofDocument(parsed.proof, provider);
        credentialsArray.push(VerifiableCredential.DecodeFromJSON(parsed, decodedProof));
    }

    //Create the presentation
    const presentation = Presentation.Create(credentialsArray);
    const presentationProof = BuildRSAProof({issuer:userDIDDocument, issuerKeyId:"keys-1", challengeNonce:challenge});
    presentationProof.Sign(presentation.EncodeToJSON());
    return VerifiablePresentation.Create(presentation, presentationProof);
}

export enum VERIFICATION_LEVEL {
    UNVERIFIED = 0,
    DID_OWNER = 1,
    DID_TRUSTED = 2
}   

export async function VerifyCredentials(presentationData : VerifiablePresentationDataModel, provider : string) : Promise<VERIFICATION_LEVEL> {
    //Create objects
    const proofParameters = await DecodeProofDocument(presentationData.proof, provider);
    const verifiablePresentation = await VerifiablePresentation.DecodeFromJSON(presentationData, provider, proofParameters);

    //Verify
    SchemaManager.GetInstance().GetSchema("DIDAuthenticationCredential").AddTrustedDID(proofParameters.issuer.GetDID());
    const code = verifiablePresentation.Verify();
    SchemaManager.GetInstance().GetSchema("DIDAuthenticationCredential").RemoveTrustedDID(proofParameters.issuer.GetDID());

    //Determine level of trust
    let verificationLevel : VERIFICATION_LEVEL = VERIFICATION_LEVEL.UNVERIFIED;
    if(code == VerificationErrorCodes.SUCCES && (parseInt(presentationData.proof.nonce) + 60000) > Date.now()) { //Allow 1 minute old Authentications.
        verificationLevel = VERIFICATION_LEVEL.DID_OWNER;
        if(verifiablePresentation.GetVerifiedTypes().includes("WhiteListedCredential")) {
            verificationLevel = VERIFICATION_LEVEL.DID_TRUSTED;
        }
    } else {
        console.log('DIDAuthenticationError', code);
    }
    return verificationLevel;
}