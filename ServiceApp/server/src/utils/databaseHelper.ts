import leveldown from 'leveldown';
import levelup from 'levelup';
import { database } from '../config.json';

export const writeData = async (data, table = 'wallet', location = 'existing') => {
    return new Promise(async (resolve, reject) => {
        const db = levelup(leveldown(database[location]));
        console.log('writeData', table, database[location], data);
        db.put(table, JSON.stringify(data), async (err) => {
            if (err || data === undefined) {
                await db.close();
                return reject(err); // some kind of I/O error
            }
            await db.close();
            return resolve();
        });
    });
};

export const readData = async (table = 'wallet') => {
    return new Promise(async (resolve, reject) => {
        const db = levelup(leveldown('./market_manager'));
        try {
            db.get(table, async (err, value) => {
                if (err === null) {
                    const result = JSON.parse(value.toString());
                    await db.close();
                    return resolve(result);
                }

                console.log(err);
                // likely the key was not found
                await db.close();
                return resolve(null);
            });
        } catch (error) {
            console.log('readData', error);
            await db.close();
            return reject(null);
        }
    });
};

export const removeData = async (table) => {
    return new Promise(async (resolve, reject) => {
        const db = levelup(leveldown('./market_manager'));
        try {
            db.del(table, async (err) => {
                if (err) {
                    console.log('removeData', err);
                }
                console.log('removeData OK');
                await db.close();
                return resolve(null);
            });
        } catch (error) {
            console.log('removeData', error);
            await db.close();
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

await writeData(data, entry);
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
