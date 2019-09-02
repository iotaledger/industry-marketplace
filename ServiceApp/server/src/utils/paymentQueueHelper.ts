import { readAllData, removeData, writeData } from './databaseHelper';

export const addToPaymentQueue = async (address, value) => {
    try {
        await writeData('paymentQueue', { address, value });
    } catch (error) {
        console.error('addToPaymentQueue', address, error);
    }
};

export const processPaymentQueue = async () => {
    try {
        const currentUserObject = await readAllData('paymentQueue');
        await removeData('paymentQueue');
        return currentUserObject || [];
    } catch (error) {
        console.error('processPaymentQueue', error);
    }
};
