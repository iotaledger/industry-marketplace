import crypto from 'crypto';
import { readRow } from './databaseHelper';
import { DIDDocument, DID } from 'identity_ts';


const provider = process.env.provider

const passphrase = 'Semantic Market runs on IOTA! @(^_^)@';

export const generateKeyPair = async () => {
    return new Promise((resolve, reject) => {
        try {
            crypto.generateKeyPair('rsa', {
                modulusLength: 2048,
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem'
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem',
                    cipher: 'aes-256-cbc',
                    passphrase
                }
            // tslint:disable-next-line:align
            }, (err, publicKey, privateKey) => {
                if (err) {
                    reject(err);
                } // may signify a bad 'type' name, etc
                resolve({ publicKey, privateKey });
            });
        } catch (error) {
            console.error('generateKeyPair error', error);
            reject();
        }
    });
};

/*const encrypt = async (key, message) => {
    return new Promise(async (resolve, reject) => {
        try {
            const payload: any = { key, passphrase, padding: crypto.constants.RSA_PKCS1_PADDING };
            const result = await crypto.publicEncrypt(payload, message);
            resolve(result);
        } catch (error) {
            console.error('encrypt error', error);
            reject();
        }
    });
};*/

const decrypt = async (key, message) => {
    return new Promise(async (resolve, reject) => {
        try {
            const payload: any = { key, passphrase, padding: crypto.constants.RSA_PKCS1_PADDING };
            const result = await crypto.privateDecrypt(payload, message);
            resolve(result);
        } catch (error) {
            console.error('decrypt error', error);
            reject();
        }
    });
};

export const encryptWithReceiversPublicKey = async (receiverId, keyId, payload) => {
    const document = await DIDDocument.readDIDDocument(provider, new DID(receiverId).GetUUID());
    const encryptedBuffer = await document.GetKeypair(keyId).GetEncryptionKeypair().PublicEncrypt(payload);
    return encryptedBuffer.toString('base64');
};

export const decryptWithReceiversPrivateKey = async (payload, did ) => {

    interface IEncryption {
        root?: string;
        privateKey?: string;
    }

    const encryption: IEncryption = await readRow('did', 'root', did );
    const { privateKey } = encryption
    const messageBuffer = Buffer.from(payload.secretKey, 'base64');
    const decryptedBuffer = await decrypt(privateKey, messageBuffer);
    return decryptedBuffer.toString();
};

const algorithm =  'aes-256-cbc';

export interface EncryptedData {
    key : Buffer,
    iv: Buffer,
    encoded : Buffer
}

export function encryptWithCipher(text : string) : EncryptedData {
    const iv = crypto.randomBytes(16);
    const key = crypto.randomBytes(32);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted : Buffer = cipher.update(text);
    return { key: key, iv : iv, encoded: Buffer.concat([encrypted,cipher.final()]) };
}

export function decryptCipher(data : EncryptedData) : Buffer {
    const decipher = crypto.createDecipheriv(algorithm, data.key, data.iv);
    let decoded : Buffer = decipher.update(data.encoded);
    return Buffer.concat([decoded, decipher.final()]);
}