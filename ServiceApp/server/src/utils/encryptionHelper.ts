import crypto from 'crypto';
import { DID, DIDDocument, ECDSAKeypair } from 'identity_ts';
import { Network, Document, Client, Config, KeyPair } from '@iota/identity-wasm/node';
import { provider, networkType } from '../config.json';
import { readData } from './databaseHelper';

export const encryptWithReceiversPublicKeyC2 = async (receiverId, keyId, payload) => {
    // Create a default client configuration from the parent config network.
    const config = Config.fromNetwork(networkType === "main" ? Network.mainnet() : Network.testnet());
    const client = Client.fromConfig(config);
    const resolveRequest = await client.resolve(receiverId);
    const issuerDIDJSON = resolveRequest.document;
    const document = Document.fromJSON(issuerDIDJSON)

    //TODO: How do I access the public-key? How would I encrypt with the public key?
    

    //const encryptedBuffer = await document.GetKeypair(keyId).GetEncryptionKeypair().PublicEncrypt(payload);
    //return encryptedBuffer.toString('base64');
};

export const decryptWithReceiversPrivateKeyC2 = async (payload) => {
    const did: any = await readData('did');
    const messageBuffer = Buffer.from(payload.secretKey, 'base64');
    //TODO: How to proceed with encryption without ECDSAKeyPair?
    //return decryptedBuffer.toString();
};

//TODO: Migrate DID
export const encryptWithReceiversPublicKey = async (receiverId, keyId, payload) => {
    const document = await DIDDocument.readDIDDocument(provider, new DID(receiverId).GetUUID());
    const encryptedBuffer = await document.GetKeypair(keyId).GetEncryptionKeypair().PublicEncrypt(payload);
    return encryptedBuffer.toString('base64');
};
//TODO: Migrate DID
export const decryptWithReceiversPrivateKey = async (payload) => {
    const did: any = await readData('did');
    const messageBuffer = Buffer.from(payload.secretKey, 'base64');
    const encryptionKeypair = new ECDSAKeypair('', did.privateKey);
    const decryptedBuffer = await encryptionKeypair.PrivateDecrypt(messageBuffer);
    return decryptedBuffer.toString();
};

const algorithm =  'aes-256-cbc';

export interface IEncryptedData {
    key: Buffer;
    iv: Buffer;
    encoded: Buffer;
}

export function encryptWithCipher(text: string): IEncryptedData {
    const iv = crypto.randomBytes(16);
    const key = crypto.randomBytes(32);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    const encrypted: Buffer = cipher.update(text);
    return { key: key, iv : iv, encoded: Buffer.concat([encrypted, cipher.final()]) };
}

export function decryptCipher(data: IEncryptedData): Buffer {
    const decipher = crypto.createDecipheriv(algorithm, data.key, data.iv);
    const decoded: Buffer = decipher.update(data.encoded);
    return Buffer.concat([decoded, decipher.final()]);
}
