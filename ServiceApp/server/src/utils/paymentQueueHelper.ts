// https://s3.amazonaws.com/stitch-sdks/js/docs/master/index.html#collection
// https://docs.mongodb.com/stitch/mongodb/enforce-a-document-schema/
const {
    Stitch,
    RemoteMongoClient,
    AnonymousCredential
} = require('mongodb-stitch-server-sdk');

const { mongoDB: {
    stitchApplicationID,
    stitchServiceName,
    database,
    collection,
}} = require('../config.json');

// Initialize the app client
const app = Stitch.hasAppClient(stitchApplicationID)
    ? Stitch.getAppClient(stitchApplicationID)
    : Stitch.initializeAppClient(stitchApplicationID);

// Initialize a MongoDB Service Client
const mongoClient = app.getServiceClient(RemoteMongoClient.factory, stitchServiceName);

// Instantiate a collection handle for payment queue
const items = mongoClient.db(database).collection(collection);

export const fetchUserPaymentQueue = async userId => {
    await loginAnonymous();
    return await items.findOne({ userId })
    .catch(error => {
        console.error('fetchUserPaymentQueue', userId, error);
    });
}

export const addToPaymentQueue = async (userId, payload) => {
    await loginAnonymous();
    const currentUserObject = await fetchUserPaymentQueue(userId);
    const currentPaymentQueue = currentUserObject && currentUserObject.paymentQueue || [];
    await items.updateOne({ userId }, { $set: {
        timestamp: Date.now(),
        paymentQueue: [ ...currentPaymentQueue, payload]
    }}, { upsert: true })
    .catch(error => {
        console.error('addToPaymentQueue', userId, error);
    });
}

export const processPaymentQueue = async userId => {
    await loginAnonymous();
    const currentUserObject = await fetchUserPaymentQueue(userId);
    await items.deleteOne({ userId })
        .catch(error => {
            console.error('processPaymentQueue', userId, error);
        });
    return currentUserObject && currentUserObject.paymentQueue || [];
}

// Allow users to log in anonymously
export const loginAnonymous = () => app.auth.loginWithCredential(new AnonymousCredential());
