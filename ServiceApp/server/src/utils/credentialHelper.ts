import { 
    CreateRandomDID, 
    GenerateECDSAKeypair, 
    GenerateSeed
} from 'identity_ts';
import { keyId } from '../config.json';
import { writeData } from './databaseHelper';

export interface IUser {
    id: string;
    name: string;
    role: string;
    location: string;
    address: string;
}

export function createNewUser(name: string = '', role: string = '', location: string = ''): Promise <IUser> {
    return new Promise<IUser>(async (resolve, reject) => {
        try {
        const seed = GenerateSeed();
        const userDIDDocument = CreateRandomDID(seed);
        const keypair = await GenerateECDSAKeypair();
        const tangleComsAddress = GenerateSeed(81);
        userDIDDocument.AddKeypair(keypair, keyId);

        // Store user
        const id = userDIDDocument.GetDID().GetDID();
        const user: IUser = { id, name, role, location, address: tangleComsAddress };
        await writeData('user', user);
        resolve(user);
        } catch (error) {
            console.error('Credential create user', error);
            reject(error);
        }
    });
}
