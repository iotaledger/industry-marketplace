import { getRandomRow, setWalletStatus } from './databaseHelper';


export const initializeWalletQueue = async () => {
    
    interface IWallet {
        seed?: string;
    }

    //Rotate Incoming Wallet 

    //set reserved wallet back to usable
    const IncomingWallet: IWallet = await getRandomRow('wallet', 'status', 'reserved');
    if (IncomingWallet) {
        const { seed } = await IncomingWallet
        setWalletStatus(seed, 'usable')
    }

    //reserve random wallet
    
    const newIncomingWallet: IWallet = await getRandomRow('wallet', 'status', 'usable');
    const reservedSeed = await newIncomingWallet.seed
    setWalletStatus(reservedSeed, 'reserved')
}