import * as cors from 'cors';
import * as functions from 'firebase-functions';
const { sendEmail } = require('./email');

const corsInstance = cors({ origin: true });

exports.sendEmail = functions.https.onRequest((req, res) => {
  corsInstance(req, res, async () => {
    // Check Fields
    const packet = req.body;

    if (
      !packet 
      || !packet.name 
      || !packet.email 
      || !packet.message 
      || !packet.acceptedDisclaimer
      // || !packet.captcha
    ) {
      console.error('sendEmail failed. Packet: ', packet);
      return res.status(400).json({ error: 'Malformed Request' });
    }

    try {
      // Send email
      const result = await sendEmail(packet);
      console.log('sendEmail', result);
      return res.json({ success: true, result });
    } catch (e) {
      console.error('sendEmail failed. Error: ', e.message);
      return res.status(403).json({ error: e.message });
    }
  });
});
