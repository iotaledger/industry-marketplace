const crypto = require('crypto');
const { constants: { RSA_PKCS1_PADDING },  } = require('crypto');

const passphrase = 'Semantic Market runs on IOTA! @(^_^)@';

const generate = async () => {
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
        }, (err, publicKey, privateKey) => {
            if (err) {
                throw err; 
                reject(err);
            } // may signify a bad 'type' name, etc
            resolve({ publicKey, privateKey });
        });
    });
}

const encrypt = async (key, message) => {
    return new Promise(async resolve => {
        const result = await crypto.publicEncrypt({ key, passphrase, padding: crypto.constants.RSA_PKCS1_PADDING }, message);
        resolve(result);
    });
}

const decrypt = async (key, message) => {
    return new Promise(async resolve => {
        const result = await crypto.privateDecrypt({ key, passphrase, padding: crypto.constants.RSA_PKCS1_PADDING }, message);
        resolve(result);
    });
}

const testDecrypt = async (privKey, payload) => {
    const message = Buffer.from(payload, 'base64');
    const decryptedBuffer = await decrypt(privKey, message);
    const decryptedPayload = decryptedBuffer.toString('utf8');
    console.log('payload 2', decryptedPayload);
}

const testEncrypt = async (payload) => {
    const keys = await generate();
    console.log('keys', keys);
    console.log('payload 1', payload);
    const message = Buffer.from(payload, 'utf8');
    const encryptedBuffer = await encrypt(keys.publicKey, message);
    const encryptedPayload = encryptedBuffer.toString('base64');
    testDecrypt(keys.privateKey, encryptedPayload);
}

const generateSeed = (length = 81) => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ9';
    let seed = '';
    while (seed.length < length) {
        const byte = crypto.randomBytes(1)
        if (byte[0] < 243) {
            seed += charset.charAt(byte[0] % 27);
        }
    }
    return seed;
};

const payload = generateSeed();

testEncrypt(payload);
