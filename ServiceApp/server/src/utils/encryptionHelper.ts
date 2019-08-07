import crypto from 'crypto';
import { readData } from './databaseHelper';
import { fetchDID } from './mamHelper';

const passphrase = 'Semantic Market runs on IOTA! @(^_^)@';

export const generateKeyPair = async () => {
    return new Promise((resolve, reject) => {
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
    });
};

const encrypt = async (key, message) => {
    return new Promise(async resolve => {
        const payload: any = { key, passphrase, padding: crypto.constants.RSA_PKCS1_PADDING };
        const result = await crypto.publicEncrypt(payload, message);
        resolve(result);
    });
};

const decrypt = async (key, message) => {
    return new Promise(async resolve => {
        const payload: any = { key, passphrase, padding: crypto.constants.RSA_PKCS1_PADDING };
        const result = await crypto.privateDecrypt(payload, message);
        resolve(result);
    });
};

export const encryptWithReceiversPublicKey = async (receiverId, payload) => {
    const partnetId = receiverId.replace('did:iota:', '');
    const did = await fetchDID(partnetId);
    const publicKey = did[did.length - 1];
    const message = Buffer.from(payload, 'utf8');
    const encryptedBuffer: any = await encrypt(publicKey, message);
    return encryptedBuffer.toString('base64');
};

export const decryptWithReceiversPrivateKey = async (payload) => {
    const did: any = await readData('did');
    const messageBuffer = Buffer.from(payload.secretKey, 'base64');
    const decryptedBuffer = await decrypt(did.privateKey, messageBuffer);
    return decryptedBuffer.toString();
};
