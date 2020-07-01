import { 
    CreateRandomDID, 
    DecodeProofDocument, 
    DIDDocument, 
    DIDPublisher, 
    ECDSAKeypair, 
    GenerateECDSAKeypair, 
    GenerateSeed, 
    Presentation,
    ProofParameters,
    ProofTypeManager, 
    SchemaManager, 
    Service, 
    SignDIDAuthentication, 
    VerifiableCredential,
    VerifiableCredentialDataModel,
    VerifiablePresentation,
    VerifiablePresentationDataModel
} from 'identity_ts';
import { depth, keyId, minWeightMagnitude } from '../config.json';
import { createCredential, readData, writeData } from './databaseHelper';
import { decryptCipher } from './encryptionHelper';
import { getAvailableProvider } from './iotaHelper';

export interface IUser {
    id: string;
    name: string;
    role: string;
    location: string;
    address: string;
}

export function createNewUser(name: string = '', role: string = '', location: string = ''): Promise <IUser> {
    return new Promise<IUser>(async (resolve, reject) => {
        try {
        const seed = GenerateSeed();
        const userDIDDocument = CreateRandomDID(seed);
        const keypair = await GenerateECDSAKeypair();
        const privateKey = keypair.GetPrivateKey();
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
        const provider = await getAvailableProvider();
        const publisher = new DIDPublisher(provider, seed);
        const root = await publisher.PublishDIDDocument(userDIDDocument, 'SEMARKET', minWeightMagnitude, depth);
        const state = publisher.ExportMAMChannelState();
        await writeData('did', { root, privateKey, keyId, seed, next_root: state.nextRoot , start: state.start });

        // Store user
        const id = userDIDDocument.GetDID().GetDID();
        const user: IUser = { id, name, role, location, address: tangleComsAddress };
        await writeData('user', user);
        resolve(user);
        } catch (error) {
            console.error('Credential create user', error);
            reject(error);
        }
    });
}

export async function processReceivedCredentialForUser(unstructuredData: any) {
    // Filter out incorrectly structured transactions
    if (!unstructuredData.key || !unstructuredData.iv || !unstructuredData.data) {
        return;
    }
    const data: { key: string; iv: string; data: string } = unstructuredData;

    // Get pieces for decryption
    const did: any = await readData('did');
    const encryptionKeypair = new ECDSAKeypair('', did.privateKey);
    data.key = await encryptionKeypair.PrivateDecrypt(Buffer.from(data.key, 'hex'));
    const credentialString = decryptCipher({key : Buffer.from(data.key, 'hex'), iv: Buffer.from(data.iv, 'hex'), encoded: Buffer.from(data.data, 'hex')}).toString('utf8');

    // Verify the credential is valid and for this user
    try {
        const provider = await getAvailableProvider();
        const credentialJSON = JSON.parse(credentialString);
        const credentialFormat = <VerifiableCredentialDataModel>credentialJSON;
        
        const proofParameters: ProofParameters = await DecodeProofDocument(credentialFormat.proof, provider);
        const importVerifiableCredential: VerifiableCredential = await VerifiableCredential.DecodeFromJSON(credentialFormat, proofParameters);
        const user: any = await readData('user');
        const credentialSubject = importVerifiableCredential.EncodeToJSON().credentialSubject;

        importVerifiableCredential.Verify(provider)
            .then(async () => {
                if (credentialSubject['DID'] === user.id) {
                    //Store the credential in the DB, sorted under the DID of the Issuer
                    await createCredential({ id: credentialFormat.proof.creator, credential : credentialString});
                    console.log('Credential Stored: ', credentialString);
                }
            })
            .catch(() => {
                console.log('Credential Target: ', credentialSubject['DID']);
            });
    } catch (e) {
        console.log('Credential Verification Error: ', e);
    }
}
// request.frame.conversationId
export async function createAuthenticationPresentation(): Promise<VerifiablePresentation> {
    // 1.25 Sign DID Authentication
    return new Promise<VerifiablePresentation> (async (resolve, reject) => {
        try {
            const challenge = Date.now().toString();
            const did: any = await readData('did');
            const provider = await getAvailableProvider();

            // Read DID Document might fail when no DID is actually located at the root - Unlikely as it is the DID of this instance
            const issuerDID = await DIDDocument.readDIDDocument(provider, did.root);
            issuerDID.GetKeypair(did.keyId).GetEncryptionKeypair().SetPrivateKey(did.privateKey);
            SchemaManager.GetInstance().GetSchema('DIDAuthenticationCredential').AddTrustedDID(issuerDID.GetDID());
            
            const didAuthCredential = SignDIDAuthentication(issuerDID, did.keyId, challenge);

            // Add the stored Credential
            const credentialsArray: VerifiableCredential[] = [didAuthCredential];
            const whiteListCredential: any = await readData('credentials');
            if (whiteListCredential) {
                const parsed = JSON.parse(whiteListCredential.credential);
                const decodedProof = await DecodeProofDocument(parsed.proof, provider);
                credentialsArray.push(VerifiableCredential.DecodeFromJSON(parsed, decodedProof));
            }

            // Create presentation
            const presentation = Presentation.Create(credentialsArray);
            const presentationProof = ProofTypeManager.GetInstance()
                .CreateProofWithBuilder('EcdsaSecp256k1VerificationKey2019', { 
                    issuer: issuerDID, 
                    issuerKeyId: keyId, 
                    challengeNonce: challenge
            });

            presentationProof.Sign(presentation.EncodeToJSON());
            resolve(VerifiablePresentation.Create(presentation, presentationProof));
        } catch (error) {
            reject(error);
        }
    });    
}

export enum VERIFICATION_LEVEL {
    UNVERIFIED = 0,
    DID_OWNER = 1,
    DID_TRUSTED = 2
}   

export async function verifyCredentials(presentationData: VerifiablePresentationDataModel): Promise<VERIFICATION_LEVEL> {
    return new Promise<VERIFICATION_LEVEL>(async (resolve, reject) => {
        try {
            // Create objects
            const provider = await getAvailableProvider();
            const proofParameters: ProofParameters = await DecodeProofDocument(presentationData.proof, provider);
            const verifiablePresentation: VerifiablePresentation = await VerifiablePresentation.DecodeFromJSON(presentationData, provider, proofParameters);
            
            // Verify
            SchemaManager.GetInstance().GetSchema('DIDAuthenticationCredential').AddTrustedDID(proofParameters.issuer.GetDID());
            
            verifiablePresentation.Verify(provider)
                .then(() => {
                    // Determine level of trust
                    let verificationLevel: VERIFICATION_LEVEL = VERIFICATION_LEVEL.UNVERIFIED;
                    
                    if ((parseInt(presentationData.proof.nonce, 10) + 60000) > Date.now()) { // Allow 1 minute old Authentications.
                        verificationLevel = VERIFICATION_LEVEL.DID_OWNER;
                        if (verifiablePresentation.GetVerifiedTypes().includes('WhiteListedCredential')) {
                            verificationLevel = VERIFICATION_LEVEL.DID_TRUSTED;
                        }
                    }

                    resolve(verificationLevel);
                })
                .catch(() => {
                    resolve(VERIFICATION_LEVEL.UNVERIFIED);
                })
                .finally(() => {
                    SchemaManager.GetInstance().GetSchema('DIDAuthenticationCredential').RemoveTrustedDID(proofParameters.issuer.GetDID());
                });
        } catch (error) {
            reject(error);
        }
    });
}
