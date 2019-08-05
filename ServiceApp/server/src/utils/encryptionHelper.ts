import crypto from 'crypto';

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

export const encrypt = async (key, message) => {
    return new Promise(async resolve => {
        const payload: any = { key, passphrase, padding: crypto.constants.RSA_PKCS1_PADDING };
        const result = await crypto.publicEncrypt(payload, message);
        resolve(result);
    });
};

export const decrypt = async (key, message) => {
    return new Promise(async resolve => {
        const payload: any = { key, passphrase, padding: crypto.constants.RSA_PKCS1_PADDING };
        const result = await crypto.privateDecrypt(payload, message);
        resolve(result);
    });
};
