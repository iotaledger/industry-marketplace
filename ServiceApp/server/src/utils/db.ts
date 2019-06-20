import leveldown from 'leveldown';
import levelup from 'levelup';
import { database } from '../config.json';

export const writeData = async (data, table = 'wallet', location = 'existing') => {
    return new Promise(async (resolve, reject) => {
        const db = levelup(leveldown(database[location]));
        db.put(table, JSON.stringify(data), (err) => {
            if (err) {
                db.close();
                reject(err); // some kind of I/O error
            }
            db.close();
            resolve();
        });
    });
};

export const readData = async (table = 'wallet') => {
    return new Promise(async (resolve, reject) => {
        const db = levelup(leveldown('./market_manager'));
        db.get(table, (err, value) => {
            if (err) {
                db.close();
                reject(err);
            } // likely the key was not found
            const result = JSON.parse(value.toString());
            db.close();
            resolve(result);
        });
    });
};

// const data = {
//     address: 'CCCCCDDDDD',
//     seed: 'SSSSSSEEEEDDDD',
//     amount: 555
// }

// const run = async () => {
//     await writeData(data)
//     const result = await readData()
//     console.log(result.address, result.amount, result.seed)
// }

// run()
