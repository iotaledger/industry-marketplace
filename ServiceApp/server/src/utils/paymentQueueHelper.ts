import {readAllData, writeData, removeData} from './databaseHelper';


export const fetchUserPaymentQueue = async () => {
    try{
    const userObject: any =  await readAllData('paymentQueue')
    return (userObject);
    } catch(error) {
        console.error('fetchUserPaymentQueue', error);
    }
}

export const addToPaymentQueue = async (address, value) => {
    try{
    await writeData('paymentQueue', {address, value })
    }
    catch(error) {
        console.error('addToPaymentQueue', address, error);
    }
}


export const processPaymentQueue = async () => {
    try{
    const currentUserObject = await fetchUserPaymentQueue();
    await removeData('paymentQueue');
    return currentUserObject || []
    } catch(error) {
        console.error('processPaymentQueue', error);
    }
}
