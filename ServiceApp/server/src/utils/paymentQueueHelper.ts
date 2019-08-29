// https://s3.amazonaws.com/stitch-sdks/js/docs/master/index.html#collection
// https://docs.mongodb.com/stitch/mongodb/enforce-a-document-schema/
import {
    AnonymousCredential,
    RemoteMongoClient,
    Stitch
} from 'mongodb-stitch-server-sdk';
import { mongoDB } from '../config.json';

// Initialize the app client
const app = Stitch.hasAppClient(mongoDB.stitchApplicationID)
    ? Stitch.getAppClient(mongoDB.stitchApplicationID)
    : Stitch.initializeAppClient(mongoDB.stitchApplicationID);

// Initialize a MongoDB Service Client
const mongoClient = app.getServiceClient(RemoteMongoClient.factory, mongoDB.stitchServiceName);

// Instantiate a collection handle for payment queue
const items = mongoClient.db(mongoDB.database).collection(mongoDB.collection);

export const fetchUserPaymentQueue = async userId => {
    await getCurrentUser();
    return await items.findOne({ userId })
    .catch(error => {
        console.error('fetchUserPaymentQueue', userId, error);
    });
};

export const addToPaymentQueue = async (userId, payload) => {
    await getCurrentUser();
    const currentUserObject: any = await fetchUserPaymentQueue(userId);
    const currentPaymentQueue = currentUserObject && currentUserObject.paymentQueue || [];
    await items.updateOne(
        { userId }, 
        { $set: {
            timestamp: Date.now(),
            paymentQueue: [ ...currentPaymentQueue, payload]}}, 
        { upsert: true })
        .catch(error => {
            console.error('addToPaymentQueue', userId, error);
        });
};

export const processPaymentQueue = async userId => {
    await getCurrentUser();
    const currentUserObject: any = await fetchUserPaymentQueue(userId);
    await items.deleteOne({ userId })
        .catch(error => {
            console.error('processPaymentQueue', userId, error);
        });
    return currentUserObject && currentUserObject.paymentQueue || [];
};

// Allow users to log in anonymously
export const loginAnonymous = async () => await app.auth.loginWithCredential(new AnonymousCredential());

// Check if there is currently a logged in user
export const hasLoggedInUser = () => app.auth.isLoggedIn;

// Return the user object of the currently logged in user
export const getCurrentUser = async () => {
    const isLoggedIn = hasLoggedInUser();
    if (!isLoggedIn) {
        await loginAnonymous();
    }
    return app.auth.user;
};
