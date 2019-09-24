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
import { createCredential, readData, writeData } from './databaseHelper';
import { provider } from '../config.json';
import { decryptCipher } from './encryptionHelper';

export interface IUser {
    id : string,
    name : string,
    role : string,
    location : string,
    address : string
};

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

export async function ProcessReceivedCredentialForUser(unstructuredData: any, provider: string) {
    // Filter out incorrectly structured transactions
    if (!unstructuredData.key || !unstructuredData.iv || !unstructuredData.data) {
        return;
    }
    const data: { key: string, iv: string, data: string } = unstructuredData;

    // Get pieces for decryption
    const did: any = await readData('did');
    const encryptionKeypair = new RSAKeypair(null, did.privateKey);
    data.key = await encryptionKeypair.PrivateDecrypt(Buffer.from(data.key, 'hex'));
    const credentialString = decryptCipher({key : Buffer.from(data.key, 'hex'), iv: Buffer.from(data.iv, 'hex'), encoded: Buffer.from(data.data, 'hex')}).toString('utf8');

    // Verify the credential is valid and for this user
    try {
        const credentialJSON = JSON.parse(credentialString);
        const credentialFormat = <VerifiableCredentialDataModel>credentialJSON;
        
        const proofParameters: ProofParameters = await DecodeProofDocument(credentialFormat.proof, provider);
        const importVerifiableCredential: VerifiableCredential = await VerifiableCredential.DecodeFromJSON(credentialFormat, proofParameters);
        const user: any = await readData('user');
        const verificationResult = importVerifiableCredential.Verify();

        if (importVerifiableCredential.EncodeToJSON().credentialSubject['DID'] === user.id && verificationResult === VerificationErrorCodes.SUCCES) {
            //Store the credential in the DB, sorted under the DID of the Issuer
            await createCredential({ id: credentialFormat.proof.creator, credential : credentialString});
            console.log('Credential Stored: ', credentialString);
        } else {
            console.log('Credential Target: ', importVerifiableCredential.EncodeToJSON().credentialSubject['DID']);
            console.log('VerificationResult: ', verificationResult);
        }
        
    } catch (e) {
        console.log('Credential Verification Error: ', e);
    }
}
// request.frame.conversationId
export async function CreateAuthenticationPresentation(provider: string): Promise<VerifiablePresentation> {
    // 1.25 Sign DID Authentication
    return new Promise<VerifiablePresentation> (async (resolve, reject) => {
        const challenge = Date.now().toString();
        const did: any = await readData('did');

        // Read DID Document might fail when no DID is actually located at the root - Unlikely as it is the DID of this instance
        DIDDocument.readDIDDocument(provider, did.root)
        .then(async (userDIDDocument) => {
            userDIDDocument.GetKeypair(did.keyId).GetEncryptionKeypair().SetPrivateKey(did.privateKey);
            const didAuthCredential = SignDIDAuthentication(userDIDDocument, did.keyId, challenge);

            // Add the stored Credential
            const credentialsArray: VerifiableCredential[] = [didAuthCredential];
            const whiteListCredential: any = await readData('credentials');
            if (whiteListCredential) {
                const parsed = JSON.parse(whiteListCredential.credential);
                const decodedProof = await DecodeProofDocument(parsed.proof, provider);
                credentialsArray.push(VerifiableCredential.DecodeFromJSON(parsed, decodedProof));
            }

            // Create the presentation
            const presentation = Presentation.Create(credentialsArray);
            const presentationProof = BuildRSAProof({issuer: userDIDDocument, issuerKeyId: 'keys-1', challengeNonce: challenge});
            presentationProof.Sign(presentation.EncodeToJSON());
            resolve(VerifiablePresentation.Create(presentation, presentationProof));
        }).catch(reject);
    });    
}

export enum VERIFICATION_LEVEL {
    UNVERIFIED = 0,
    DID_OWNER = 1,
    DID_TRUSTED = 2
}   

export async function VerifyCredentials(presentationData: VerifiablePresentationDataModel, provider: string): Promise<VERIFICATION_LEVEL> {
    return new Promise<VERIFICATION_LEVEL>(async (resolve, reject) => {
        // Create objects
        DecodeProofDocument(presentationData.proof, provider)
        .then((proofParameters) => {
            VerifiablePresentation.DecodeFromJSON(presentationData, provider, proofParameters)
            .then((verifiablePresentation) => {
                // Verify
                SchemaManager.GetInstance().GetSchema('DIDAuthenticationCredential').AddTrustedDID(proofParameters.issuer.GetDID());
                const code = verifiablePresentation.Verify();
                SchemaManager.GetInstance().GetSchema('DIDAuthenticationCredential').RemoveTrustedDID(proofParameters.issuer.GetDID());

                // Determine level of trust
                let verificationLevel: VERIFICATION_LEVEL = VERIFICATION_LEVEL.UNVERIFIED;
                if (code === VerificationErrorCodes.SUCCES && (parseInt(presentationData.proof.nonce) + 60000) > Date.now()) { // Allow 1 minute old Authentications.
                    verificationLevel = VERIFICATION_LEVEL.DID_OWNER;
                    if (verifiablePresentation.GetVerifiedTypes().includes('WhiteListedCredential')) {
                        verificationLevel = VERIFICATION_LEVEL.DID_TRUSTED;
                    }
                } else {
                    console.log('DIDAuthenticationError', code);
                }
                resolve(verificationLevel);
            }).catch(reject);            
        }).catch(reject);
    });
}
