import path from 'path';
import sqlite3 from 'sqlite3';
import { database } from '../config.json';

sqlite3.verbose();
const db = new sqlite3.Database(
    path.resolve(__dirname, database), error => {
        if (error) {
            return console.error(error.message);
        }
        db.run('CREATE TABLE IF NOT EXISTS user (id TEXT PRIMARY KEY, role TEXT)');
        db.run('CREATE TABLE IF NOT EXISTS wallet (seed TEXT PRIMARY KEY, address TEXT, keyIndex INTEGER, balance INTEGER)');
        db.run('CREATE TABLE IF NOT EXISTS mam (id TEXT PRIMARY KEY, root TEXT, seed TEXT, next TEXT, secretKey TEXT, start INTEGER)');
    }
);

export const close = async () => {
    db.close(error => {
        if (error) {
            return console.error(error.message);
        }
    });
};

export const createUser = async ({ id, role }) => {
    await db.run('REPLACE INTO user (id, role) VALUES (?, ?)', [id, role]);
};

export const createWallet = async ({ seed, address, balance, keyIndex }) => {
    await db.run('REPLACE INTO wallet (seed, address, balance, keyIndex) VALUES (?, ?, ?, ?)', [seed, address, balance, keyIndex]);
};

export const createMAMChannel = async ({ id, root, seed, next, secretKey, start }) => {
    const insert = `
        INSERT INTO mam (
        id, root, seed, next, secretKey, start)
        VALUES (?, ?, ?, ?, ?, ?)`;
    await db.run(insert, [id, root, seed, next, secretKey, start]);
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
            case 'mam':
            default:
                await createWallet(data);
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
            console.log('Read data from', table);
            let query = `SELECT * FROM ${table} LIMIT 1`;
            if (searchField) {
                query = `SELECT * FROM ${table} WHERE id = ${searchField} ORDER BY rowid DESC LIMIT 1`;
            }
            db.all(query, (err, rows) => {
                err ? reject(err) : resolve(rows[0]);
            });
        } catch (error) {
            console.log('readData', error);
            reject();
        }
    });
};

export const removeData = (table) => {
    return new Promise(async resolve => {
        await db.run(`DROP TABLE IF EXISTS ${table}`);
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
