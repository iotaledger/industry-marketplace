import leveldown from 'leveldown';
import levelup from 'levelup';

const db = levelup(leveldown('../../wallet'));

const writeData = async data => {
    return new Promise(async (resolve, reject) => {
        db.put('wallet', JSON.stringify(data), (err) => {
            if (err) {
                reject(err); // some kind of I/O error
            }
            resolve();
        });
    });
};

const readData = async () => {
    return new Promise(async (resolve, reject) => {
        db.get('wallet', (err, value) => {
            if (err) {
                reject(err);
            } // likely the key was not found
            const result = JSON.parse(value.toString());
            resolve(result);
        });
    });
};

module.exports = {
    readData,
    writeData
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
