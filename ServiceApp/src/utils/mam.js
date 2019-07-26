import { trytesToAscii } from '@iota/converter';
import Mam from '@iota/mam';
import { provider } from '../config.json';

export const fetch = (root, key, reportEvent, onFetchComplete) => {
  if (!provider || !root) return;
  const promise = new Promise(async (resolve, reject) => {
    try {
      Mam.init(provider);
      const convertAndReport = event => reportEvent(JSON.parse(trytesToAscii(event)));
      await Mam.fetch(root, 'restricted', key, convertAndReport);
      return resolve(onFetchComplete());
    } catch (error) {
      console.log('MAM fetch error', error);
      return reject();
    }
  });

  return promise;
};