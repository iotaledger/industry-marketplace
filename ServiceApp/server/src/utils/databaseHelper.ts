import path from 'path';
import sqlite3 from 'sqlite3';
import { database } from '../config.json';

sqlite3.verbose();
const db = new sqlite3.Database(
    path.resolve(__dirname, database), async error => {
        if (error) {
            return console.error('New database Error', error);
        }
        await db.run('CREATE TABLE IF NOT EXISTS user (id TEXT PRIMARY KEY, name TEXT, role TEXT, location TEXT, address TEXT)');
        await db.run('CREATE TABLE IF NOT EXISTS wallet (seed TEXT PRIMARY KEY, address TEXT, keyIndex INTEGER, balance INTEGER)');
        // tslint:disable-next-line:max-line-length
        await db.run('CREATE TABLE IF NOT EXISTS mam (id TEXT PRIMARY KEY, root TEXT, seed TEXT, mode TEXT, sideKey TEXT, security INTEGER, start INTEGER, count INTEGER, nextCount INTEGER, keyIndex INTEGER, nextRoot TEXT)');
        await db.run('CREATE TABLE IF NOT EXISTS data (id TEXT PRIMARY KEY, deviceId TEXT, userId TEXT, schema TEXT)');
        // tslint:disable-next-line:max-line-length
        await db.run('CREATE TABLE IF NOT EXISTS did (root TEXT, privateKey TEXT, keyId TEXT, seed TEXT, mode TEXT, sideKey TEXT, security INTEGER, start INTEGER, count INTEGER, nextCount INTEGER, keyIndex INTEGER, nextRoot TEXT)');
        await db.run('CREATE TABLE IF NOT EXISTS paymentQueue (address TEXT, value INTEGER)');
        await db.run('CREATE TABLE IF NOT EXISTS credentials (id TEXT, credential TEXT)');
    }
);

export const close = async () => {
    db.close(error => {
        if (error) {
            return console.error('DB close', error.message);
        }
    });
};

export const createUser = async ({ id, name = '', role = '', location = '', address = '' }) => {
    await db.run('REPLACE INTO user (id, name, role, location, address) VALUES (?, ?, ?, ?, ?)', [id, name, role, location, address]);
};

export const createWallet = async ({ seed, address, balance, keyIndex }) => {
    await db.run('REPLACE INTO wallet (seed, address, balance, keyIndex) VALUES (?, ?, ?, ?)', [seed, address, balance, keyIndex]);
};

export const createSensorData = async ({ id, deviceId, userId, schema }) => {
    await db.run('REPLACE INTO data (id, deviceId, userId, schema) VALUES (?, ?, ?, ?)', [id, deviceId, userId, schema]);
};

export const createPaymentQueue = async ({ address, value }) => {
    await db.run('REPLACE INTO paymentQueue (address, value) VALUES (?, ?)', [address, value]);
};

export const createDID = async ({ root, privateKey, keyId, seed, mode = 'private', sideKey = '', security, start, count = 1, nextCount = 1, index = 0, nextRoot }) => {
    const insert = `
        INSERT INTO did (
        root, privateKey, keyId, seed, mode, sideKey, security, start, count, nextCount, keyIndex, nextRoot)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    await db.run(insert, [root, privateKey, keyId, seed, mode, sideKey, security, start, count, nextCount, index, nextRoot]);
};

export const createMAMChannel = async ({ id, root, seed, mode, sideKey, security, start, count = 1, nextCount = 1, index = 0, nextRoot }) => {
    const insert = `
        REPLACE INTO mam (
        id, root, seed, mode, sideKey, security, start, count, nextCount, keyIndex, nextRoot)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    await db.run(insert, [id, root, seed, mode, sideKey, security, start, count, nextCount, index, nextRoot]);
};

export const createCredential = async ({ id, credential }) => {
    await db.run('INSERT INTO credentials (id, credential) VALUES (?, ?)', [id, credential]);
};

export const writeData = async (table, data) => {
    try {
        console.log('writeData', table, data);
        switch (table) {
            case 'user':
                await createUser(data);
                return;
            case 'wallet':
                await createWallet(data);
                return;
            case 'data':
                await createSensorData(data);
                return;
            case 'did':
                await createDID(data);
                return;
            case 'paymentQueue':
                await createPaymentQueue(data);
                return;
            case 'credential':
                await createCredential(data);
                return;
            case 'mam':
            default:
                await createMAMChannel(data);
                return;
        }
    } catch (error) {
        console.log('writeData', error);
        return null;
    }
};

export const readData = async (table, searchField = null) => {
    return new Promise((resolve, reject) => {
        try {
            let query = `SELECT * FROM ${table} ORDER BY rowid DESC LIMIT 1`;
            if (searchField) {
                query = `SELECT * FROM ${table} WHERE id = '${searchField}' ORDER BY rowid DESC LIMIT 1`;
            }
            db.get(query, (err, row) => {
                if (err) {
                    return resolve(null);
                } else {
                    return resolve(row || null);
                }
            });
        } catch (error) {
            console.log('readData', error);
            return reject(null);
        }
    });
};

export const readAllData = async (table) => {
    return new Promise((resolve, reject) => {
        try {
            db.all(`SELECT * FROM ${table}`, (err, rows) => {
                if (err) {
                    return resolve(null);
                } else {
                    return resolve(rows);
                }
            });
        } catch (error) {
            console.log('readAllData', error);
            return reject(null);
        }
    });
};

export const removeData = (table) => {
    return new Promise(async resolve => {
        await db.run(`DELETE FROM ${table}`);
        resolve(true);
    });
};

/*
Example write operation:

import { writeData } from './databaseHelper';

const data = {
    address: 'CCCCCDDDDD',
    seed: 'SSSSSSEEEEDDDD',
    amount: 555
};

await writeData('wallet', data);
*/

/*
Example read operation:

import { readData } from './databaseHelper';

const result = await readData(channelId);
if (result) {
    return result;
}

*/

/*
Example delete operation:

import { removeData } from './databaseHelper';

await removeData(entry);

*/
