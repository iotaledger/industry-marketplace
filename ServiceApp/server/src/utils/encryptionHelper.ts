import crypto from 'crypto';
import { DID, DIDDocument, ECDSAKeypair } from 'identity_ts';
import { readRow } from './databaseHelper';

const provider = process.env.PROVIDER

export const encryptWithReceiversPublicKey = async (receiverId, keyId, payload) => {
    const document = await DIDDocument.readDIDDocument(provider, new DID(receiverId).GetUUID());
    const encryptedBuffer = await document.GetKeypair(keyId).GetEncryptionKeypair().PublicEncrypt(payload);
    return encryptedBuffer.toString('base64');
};

export const decryptWithReceiversPrivateKey = async (payload, id) => {
    id = id.id.replace("did:IOTA:", "");
    console.log("ID", id)
    const did : any = await readRow('did', 'root', id)
    console.log("DID", did)
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