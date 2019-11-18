import path from 'path';
import sqlite3 from 'sqlite3';
import { database } from '../config.json';

sqlite3.verbose();
const db = new sqlite3.Database(
    path.resolve(__dirname, database), async error => {
        if (error) {
            return console.error('New database Error', error);
        }
        await db.run('CREATE TABLE IF NOT EXISTS metric (context INT, counter INT)');
    
    }
);

export const close = async () => {
    db.close(error => {
        if (error) {
            return console.error(error.message);
        }
    });
};

export const createMetric = async ({ context, counter }) => {
    await db.run('REPLACE INTO metric (context, counter) VALUES (?, ?)', [context, counter]);
};


export const writeData = async (table, data) => {
    try {
        console.log('writeData', table, data);
        switch (table) {
            default:
            case 'metric':
                await createMetric(data);
                return;
            case 'mam':
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


export const readRow = async (table, column, value) => {
    return new Promise((resolve, reject) => {
        try {
            const query = `SELECT * FROM ${table} WHERE ${column} = ? ORDER BY RANDOM() LIMIT 1`;

            db.get(query, [value], (err, row) => {
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


export const updateValue = async (table, searchField, targetField, searchValue, targetValue) => {
    return new Promise((resolve, reject) => {
        try {
            db.run(`UPDATE ${table} SET ${targetField} = ? WHERE ${searchField} = ?`, [targetValue, searchValue], (err, row) => {
                if (err) {
                    return resolve(err);
                } else {
                    return resolve();
                }
            });
        } catch (error) {
            console.log('updateValue', error);
            return reject(null);
        }
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
