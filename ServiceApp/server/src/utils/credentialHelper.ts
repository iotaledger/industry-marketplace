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
    Service as ServiceLegacy,
    SignDIDAuthentication, 
    VerifiableCredential as VerifiableCredentialLegacy,
    VerifiableCredentialDataModel,
    VerifiablePresentation as VerifiablePresentationLegacy,
    VerifiablePresentationDataModel
} from 'identity_ts';
import { depth, keyId, minWeightMagnitude, provider, security, trustedIdentities } from '../config.json';
import { createCredential, readData, removeDataWhere, writeData } from './databaseHelper';
import { decryptCipher } from './encryptionHelper';

import { Network,  KeyType, Document, Client, Config, Service, VerifiableCredential, VerifiablePresentation } from '@iota/identity-wasm/node';
//TODO: Migrate DID
export interface IUser {
    id: string;
    name: string;
    role: string;
    location: string;
    address: string;
}

export function createNewUserC2(name: string = '', role: string = '', location: string = ''): Promise<IUser> {
    return new Promise<IUser>(async (resolve, reject) => {
        const clientConfig = {
            network: "main",
            node: "https://chrysalis-nodes.iota.org:443",
        }
        try {

            // Create a new DID Document with the KeyPair as the default authentication method
            //@ts-ignore
            const { doc, key } = new Document(KeyType.Ed25519, clientConfig.network);

            const keyId = "#key";

            const privateKey = key.secret;
            const publicKey = key.public;

            //TODO: For now static
            const serviceEndpoint = "iota1qpw6k49dedaxrt854rau02talgfshgt0jlm5w8x9nk5ts6f5x5m759nh2ml" //TODO: Generate address here

            //Add a new ServiceEndpoint
            //TODO: nameFragment does not exist anymore + concept of serviceEndpoints=address still valid?
            const service: any = {
                "id": doc.id + "#tanglecom", //TODO: Is this how I would now insert a nameFragment?
                "type": "TangleCommunicationAddress",
                "serviceEndpoint": serviceEndpoint
            };

            // doc.insertService(Service.fromJSON(service));

            //Needed, as serviceEndpoint currently only works with URIs and not with IOTA addresses. Scheme is otherwise the same (attribute is only called serviceDummy instead of service)
            const serviceDummy = [service]
            const docWithService = Document.fromJSON({
                ...doc.toJSON(),
                serviceDummy
            });


            docWithService.sign(key);

            if (!docWithService.verify()) {
                reject('Created DID is not valid!');
            }


            // Create a default client configuration from the parent config network.
            const config = Config.fromNetwork(Network.mainnet());

            // Create a client instance to publish messages to the Tangle.
            const client = Client.fromConfig(config);

            // Publish the Identity to the IOTA Network, this may take a few seconds to complete Proof-of-Work.
            const messageId = await client.publishDocument(docWithService.toJSON());

            //TODO: "keyId": was previously "keys-1", now recommended #_sign-1 -Default is however "#key"
            await writeData('didC2', { messageId, id: docWithService.id.toString(), privateKey, publicKey, keyId });

            const docId = docWithService.id.toString();

            const user: IUser = { id: docId, name, role, location, address: serviceEndpoint };

            await writeData('user', user);
            resolve(user)
        }
        catch (error) {
            console.error('Credential create user', error);
            reject(error)
        }
    });
}

// export function createNewUser(name: string = '', role: string = '', location: string = ''): Promise<IUser> {
//     return new Promise<IUser>(async (resolve, reject) => {
//         try {
//         const seed = GenerateSeed();
//         const userDIDDocument = CreateRandomDID(seed);
//         const keypair = await GenerateECDSAKeypair();
//         const privateKey = keypair.GetPrivateKey();
//         const tangleComsAddress = GenerateSeed(81);
//         userDIDDocument.AddKeypair(keypair, keyId);
//         userDIDDocument.AddServiceEndpoint(
//             new ServiceLegacy(
//                 userDIDDocument.GetDID(), 
//                 'tanglecom', 
//                 'TangleCommunicationAddress', 
//                 tangleComsAddress
//             )
//         );
//         const publisher = new DIDPublisher(provider, seed);
//         const root = await publisher.PublishDIDDocument(userDIDDocument, 'SEMARKET', minWeightMagnitude, depth);
//         const state = publisher.ExportMAMChannelState();
//         await writeData('did', { root, privateKey, keyId, seed, security, start: state.start, nextRoot: state.nextRoot });

//         // Store user
//         const id = userDIDDocument.GetDID().GetDID();
//         const user: IUser = { id, name, role, location, address: tangleComsAddress };
//         await writeData('user', user);
//         resolve(user);
//         } catch (error) {
//             console.error('Credential create user', error);
//             reject(error);
//         }
//     });
// }

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
    const credentialString = decryptCipher({
        key : Buffer.from(data.key, 'hex'), 
        iv: Buffer.from(data.iv, 'hex'), 
        encoded: Buffer.from(data.data, 'hex')
    }).toString('utf8');

    // Verify the credential is valid and for this user
    try {
        const credentialJSON = JSON.parse(credentialString);
        const credentialFormat = <VerifiableCredentialDataModel>credentialJSON;
        const proofParameters: ProofParameters = await DecodeProofDocument(credentialFormat.proof, provider);
        const importVerifiableCredential: VerifiableCredentialLegacy = await VerifiableCredentialLegacy.DecodeFromJSON(credentialFormat, proofParameters);
        const user: any = await readData('user');
        const credentialSubject = importVerifiableCredential.EncodeToJSON().credentialSubject;

        importVerifiableCredential.Verify(provider)
            .then(async () => {
                // tslint:disable-next-line:no-string-literal
                if (credentialSubject['DID'] === user.id) {
                    //Store the credential in the DB, sorted under the DID of the Issuer
                    await createCredential({ id: credentialFormat.proof.creator, credential : credentialString});
                    console.log('Credential Stored: ', credentialString);
                }
            })
            .catch(() => {
                // tslint:disable-next-line:no-string-literal
                console.log('Credential Target: ', credentialSubject['DID']);
            });
    } catch (e) {
        console.log('Credential Verification Error: ', e);
    }
}

export async function createAuthenticationPresentationC2(): Promise<VerifiablePresentation> {
    // 1.25 Sign DID Authentication
    return new Promise<VerifiablePresentation>(async (resolve, reject) => {
        try {
            const challenge = Date.now().toString();
            const did: any = await readData('didC2');

            // Create a default client configuration from the parent config network.
            const config = Config.fromNetwork(Network.mainnet());

            // Create a client instance to publish messages to the Tangle.
            const client = Client.fromConfig(config);

            // Resolve a DID.
            // Read DID Document might fail when no DID is actually located at the root - Unlikely as it is the DID of this instance
            const resolveRequest = await client.resolve(did.id);

            const issuerDIDJSON = resolveRequest.document;
            const issuerDID = Document.fromJSON(issuerDIDJSON)

            writeData('trustedDIDAuthentication', issuerDID.id.toString());

            let credentialSubject = {
                id: issuerDID.id.toString(),
                challenge: challenge
            };

            const unsignedVc = VerifiableCredential.extend({
                id: "http://example.edu/credentials/3732", //TODO: ???
                type: "DIDAuthenticationCredential",
                issuer: issuerDID.id.toString(),
                credentialSubject,
            });



            const didAuthCredential: VerifiableCredential = issuerDID.signCredential(unsignedVc, {
                method: issuerDID.id.toString() + "#" + did.keyId,
                public: did.publicKey,
                secret: did.privateKey,
            });



            //TODO: We are never writing to this actually, so I just comment it out
            // Add the stored Credentials
            // const credentialsArray: VerifiableCredential[] = [didAuthCredential];
            // const whiteListCredential: any = await readData('credentialsC2'); 
            // if (whiteListCredential) {
            //     const parsed = JSON.parse(whiteListCredential.credential);
            //     credentialsArray.push(VerifiableCredential.fromJSON(parsed))

                // const decodedProof = await DecodeProofDocument(parsed.proof, provider);
                // credentialsArray.push(VerifiableCredentialLegacy.DecodeFromJSON(parsed, decodedProof));
            // }

            // Create presentation
            const unsignedVp = new VerifiablePresentation(issuerDID, didAuthCredential.toJSON());

            const signedVp = issuerDID.signPresentation(unsignedVp, {
                method: did.keyId,
                secret: did.privateKey,
            })

            console.log(signedVp.toString())
            if (await client.checkPresentation(signedVp.toString())) {
                resolve(signedVp);
            }
            else {
                reject("Could not create the DIDAuthenticationCredential");
            }
        } catch (error) {
            reject(error);
        }
    });
}

// request.frame.conversationId
// export async function createAuthenticationPresentation(): Promise<VerifiablePresentationLegacy> {
//     // 1.25 Sign DID Authentication
//     return new Promise<VerifiablePresentationLegacy>(async (resolve, reject) => {
//         try {
//             const challenge = Date.now().toString();
//             const did: any = await readData('did');

//             // Read DID Document might fail when no DID is actually located at the root - Unlikely as it is the DID of this instance
//             const issuerDID = await DIDDocument.readDIDDocument(provider, did.root);
//             issuerDID.GetKeypair(did.keyId).GetEncryptionKeypair().SetPrivateKey(did.privateKey);
//             SchemaManager.GetInstance().GetSchema('DIDAuthenticationCredential').AddTrustedDID(issuerDID.GetDID());
//             const didAuthCredential = SignDIDAuthentication(issuerDID, did.keyId, challenge);
//             // Add the stored Credential
//             const credentialsArray: VerifiableCredentialLegacy[] = [didAuthCredential];
//             const whiteListCredential: any = await readData('credentials');
//             if (whiteListCredential) {
//                 const parsed = JSON.parse(whiteListCredential.credential);
//                 const decodedProof = await DecodeProofDocument(parsed.proof, provider);
//                 credentialsArray.push(VerifiableCredentialLegacy.DecodeFromJSON(parsed, decodedProof));
//             }

//             // Create presentation
//             const presentation = Presentation.Create(credentialsArray);
//             const presentationProof = ProofTypeManager.GetInstance()
//                 .CreateProofWithBuilder('EcdsaSecp256k1VerificationKey2019', { 
//                     issuer: issuerDID, 
//                     issuerKeyId: keyId, 
//                     challengeNonce: challenge
//             });

//             presentationProof.Sign(presentation.EncodeToJSON());
//             resolve(VerifiablePresentationLegacy.Create(presentation, presentationProof));
//         } catch (error) {
//             reject(error);
//         }
//     });    
// }

export enum VERIFICATION_LEVEL {
    UNVERIFIED = 0,
    DID_OWNER = 1,
    DID_TRUSTED = 2
}  // Check the validation status of the Verifiable Presentation

//TODO: Still not called
export async function verifyCredentialsC2(presentationDataString: string): Promise<VERIFICATION_LEVEL> {
    return new Promise<VERIFICATION_LEVEL>(async (resolve, reject) => {
        try {
            // Create objects

            // Create a default client configuration from the parent config network.
            const config = Config.fromNetwork(Network.mainnet());

            // Create a client instance to publish messages to the Tangle.
            const client = Client.fromConfig(config);

            const presentationData = JSON.parse(presentationDataString);
            // Verify
            writeData('trustedDIDAuthentication', presentationData.verifiableCredential.credentialSubject.id)
            client.checkPresentation(presentationDataString) //TODO: Should already be correct format
                .then(() => {
                    // Determine level of trust
                    let verificationLevel: VERIFICATION_LEVEL = VERIFICATION_LEVEL.UNVERIFIED;

                    if ((parseInt(presentationData.verifiableCredential.credentialSubject.challenge, 10) + 60000) > Date.now()) { // Allow 1 minute old Authentications.
                        verificationLevel = VERIFICATION_LEVEL.DID_OWNER;
                        
                        if(trustedIdentities.some(presentationData.verifiableCredential.credentialSubject.id)) {
                            //id is set as a trusted identity in the config file 
                            verificationLevel = VERIFICATION_LEVEL.DID_TRUSTED;
                        }
                    }

                    resolve(verificationLevel);
                })
                .catch(() => {
                    resolve(VERIFICATION_LEVEL.UNVERIFIED);
                })
                .finally(() => {
                    removeDataWhere('trustedDIDAuthentication', `id = ${presentationData.verifiableCredential.credentialSubject.id}`)
                });
        } catch (error) {
            reject(error);
        }
    });
}

//TODO: not even called?
// export async function verifyCredentials(presentationData: VerifiablePresentationDataModel): Promise<VERIFICATION_LEVEL> {
//     return new Promise<VERIFICATION_LEVEL>(async (resolve, reject) => {
//         try {
//             // Create objects
//             const proofParameters: ProofParameters = await DecodeProofDocument(presentationData.proof, provider);
//             const verifiablePresentation: VerifiablePresentationLegacy = await VerifiablePresentationLegacy.DecodeFromJSON(presentationData, provider, proofParameters);
//             // Verify
//             SchemaManager.GetInstance().GetSchema('DIDAuthenticationCredential').AddTrustedDID(proofParameters.issuer.GetDID());
//             verifiablePresentation.Verify(provider)
//                 .then(() => {
//                     // Determine level of trust
//                     let verificationLevel: VERIFICATION_LEVEL = VERIFICATION_LEVEL.UNVERIFIED;
//                     if ((parseInt(presentationData.proof.nonce, 10) + 60000) > Date.now()) { // Allow 1 minute old Authentications.
//                         verificationLevel = VERIFICATION_LEVEL.DID_OWNER;
//                         if (verifiablePresentation.GetVerifiedTypes().includes('WhiteListedCredential')) {
//                             verificationLevel = VERIFICATION_LEVEL.DID_TRUSTED;
//                         }
//                     }

//                     resolve(verificationLevel);
//                 })
//                 .catch(() => {
//                     resolve(VERIFICATION_LEVEL.UNVERIFIED);
//                 })
//                 .finally(() => {
//                     SchemaManager.GetInstance().GetSchema('DIDAuthenticationCredential').RemoveTrustedDID(proofParameters.issuer.GetDID());
//                 });
//         } catch (error) {
//             reject(error);
//         }
//     });
// }
