import { readDataEquals } from './databaseHelper';


export const getSpecificUser = async (column, value) => {

    try {
        return new Promise(async (resolve, reject) => {
            interface IUser {
                id?: string;
                name?: string;
                role?: string;
                areaCode?: string;
            }

            const user : IUser = await readDataEquals('user', `${column}`, value)
            resolve(user)
            if (user=== 'undefined') { reject() }
        });
    } catch (error) {
        console.error(`DB Error`, error);
    }
};