import { readDataEquals, getRandomRow } from './databaseHelper';


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


export const getRandomUser = (role) => {
    try {
        return new Promise(async (resolve, reject) => {
            interface IUser {
                areaCode?: string;
                id?: string;
                role?: string;
                name?: string;
            }
            const user: IUser = await getRandomRow('user', 'role', role);
            const { id } = user
            resolve(id)
            if (id === 'undefined') { reject() }
        });
    } catch (error) {
        console.error(`No User with role ${role} in DB`, error);
    }
};
