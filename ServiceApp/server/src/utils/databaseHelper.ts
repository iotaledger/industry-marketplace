import path from 'path';
import sqlite3 from 'sqlite3';
import { database } from '../config.json';

sqlite3.verbose();
const db = new sqlite3.Database(
    path.resolve(__dirname, database), async error => {
        if (error) {
            return console.error('New database Error', error);
        }
        await db.run('CREATE TABLE IF NOT EXISTS user (id TEXT PRIMARY KEY, name TEXT, role TEXT, location TEXT)');
        await db.run('CREATE TABLE IF NOT EXISTS wallet (seed TEXT PRIMARY KEY, address TEXT, keyIndex INTEGER, balance INTEGER)');
        await db.run('CREATE TABLE IF NOT EXISTS mam (id TEXT, root TEXT, seed TEXT, next_root TEXT, side_key TEXT, start INTEGER)');
        await db.run('CREATE TABLE IF NOT EXISTS data (id TEXT PRIMARY KEY, deviceId TEXT, userId TEXT, schema TEXT)');
        await db.run('CREATE TABLE IF NOT EXISTS did (root TEXT PRIMARY KEY, privateKey TEXT, seed TEXT, next_root TEXT, start INTEGER)');
        await db.run('CREATE TABLE IF NOT EXISTS paymentQueue (address TEXT, value INTEGER)');
    }
);

export const close = async () => {
    db.close(error => {
        if (error) {
            return console.error(error.message);
        }
    });
};

export const createUser = async ({ id, name = '', role = '', location = '' }) => {
    await db.run('REPLACE INTO user (id, name, role, location) VALUES (?, ?, ?, ?)', [id, name, role, location]);
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

export const createDID = async ({ root, privateKey, seed, next_root, start }) => {
    const insert = `
        INSERT INTO did (
        root, privateKey, seed, next_root, start)
        VALUES (?, ?, ?, ?, ?)`;
    await db.run(insert, [root, privateKey, seed, next_root, start]);
};

export const createMAMChannel = async ({ id, root, seed, next_root, side_key, start }) => {
    const insert = `
        INSERT INTO mam (
        id, root, seed, next_root, side_key, start)
        VALUES (?, ?, ?, ?, ?, ?)`;
    await db.run(insert, [id, root, seed, next_root, side_key, start]);
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
        resolve();
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
