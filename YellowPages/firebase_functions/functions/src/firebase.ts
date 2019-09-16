import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);

exports.storeMessage = async (message: any) => {
  // Save message
  await admin
    .firestore()
    .collection('messages')
    .doc(message.frame.conversationId)
    .set(message);

  return true;
};

exports.getMessages = async (timestamp: string) => {
  // Get messages not older than given timestamp
  const querySnapshot = await admin
    .firestore()
    .collection('messages')
    .where('frame.replyBy', '>', Number(timestamp))
    .orderBy('frame.replyBy', 'desc')
    .limit(500)
    .get();

  if (querySnapshot.size === 0) return [];

  // Return data
  return querySnapshot.docs.map(doc => {
    if (doc.exists) {
      return doc.data();
    } else {
      console.log('getMessages failed.', timestamp, doc);
      return null;
    }
  });
};

exports.getGoogleMapsApiKey = async () => {
  const doc = await admin
    .firestore()
    .collection('settings')
    .doc('settings')
    .get();
  if (doc.exists) {
    const data = doc.data();
    if (data.googleMapsApiKey) {
      return data.googleMapsApiKey;
    }
  }
  console.log('getGoogleMapsApiKey failed. Setting does not exist', doc);
  throw Error(`The getGoogleMapsApiKey setting doesn't exist.`);
};

exports.getEmailSettings = async () => {
  const doc = await admin
    .firestore()
    .collection('settings')
    .doc('settings')
    .get();
  if (doc.exists) {
    const data = doc.data();
    return data.email || null;
  }
  console.error('getEmailSettings failed. Setting does not exist', doc);
  throw Error(`The getEmailSettings setting doesn't exist.`);
};