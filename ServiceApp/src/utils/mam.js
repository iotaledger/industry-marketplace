import { mamFetchAll, TrytesHelper } from '@iota/mam.js';
import { ServiceFactory } from '../factories/serviceFactory';

export const fetch = (root, key, reportEvent, onFetchComplete) => {
  if (!root) return;
  const promise = new Promise(async (resolve, reject) => {
    try {
      const node = ServiceFactory.get('node');
      const fetched = await mamFetchAll(node, root, 'restricted', key, 20);

      if (fetched && fetched.length > 0) {
        fetched.forEach(({ message }) => reportEvent(JSON.parse(decodeURI(TrytesHelper.toAscii(message)))));
      }

      return resolve(onFetchComplete());
    } catch (error) {
      console.log('MAM fetch error', error);
      return reject();
    }
  });

  return promise;
};