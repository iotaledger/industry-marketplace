import * as functions from 'firebase-functions';
const cors = require('cors')({ origin: true });

const { getMessages, storeMessage } = require('./firebase');
const { addressToGPS } = require('./helpers');

exports.storeMessage = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    // Check Fields
    const packet = req.body;
    if (!packet) {
      console.error('storeMessage failed. Packet: ', packet);
      return res.status(400).json({ error: 'Malformed Request' });
    }

    try {
      await storeMessage(packet);
      return res.json({ success: true });
    } catch (e) {
      console.error('storeMessage failed. Error: ', e, packet);
      return res.status(403).json({ error: e.message });
    }
  });
});

exports.getMessages = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    // Check Fields
    const params = req.query;
    if (!params || !params.timestamp) {
      console.error('getMessages failed. Params: ', params);
      return res.status(400).json({ error: 'Ensure all fields are included' });
    }
    try {
      return res.json(await getMessages(params.timestamp));
    } catch (e) {
      console.error('getMessages failed. Error: ', e, params);
      return res.status(403).json({ error: e.message });
    }
  });
});

exports.location = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const params = req.query;
      let result = null;
      if (params.address) {
        result = await addressToGPS(decodeURI(params.address));
        console.log(`Converted address "${decodeURI(params.address)}" to "${result}"`);
      }
      return res.json(result);
    } catch (e) {
      console.error('location failed. Error: ', e.message);
      return res.status(403).json({ error: e.message });
    }
  });
});
