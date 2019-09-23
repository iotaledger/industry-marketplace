import { readData } from './databaseHelper';

//Run from "build/src/utils" folder with "node didHelper.js"
function GetDID(): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
        const user: any = await readData('user');
        if (user && user.id) {
            resolve(user.id);
        }
        reject('No current user found');
    });
}

GetDID().then((result) => {
    console.log(result);
});
