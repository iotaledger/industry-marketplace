import { trytesToAscii } from '@iota/converter';
import { composeAPI } from '@iota/client-load-balancer';
import { mamFetchAll } from '@iota/mam.js';
import { ServiceFactory } from '../factories/serviceFactory';

export const fetch = (root, key, reportEvent, onFetchComplete) => {
  if (!root) return;
  const promise = new Promise(async (resolve, reject) => {
    try {
      const loadBalancerSettings = ServiceFactory.get('load-balancer-settings');
      const iota = composeAPI(loadBalancerSettings);

      const fetched = await mamFetchAll(iota, root, 'restricted', key, 20);
          
      if (fetched && fetched.length > 0) {
        fetched.forEach(({ message }) => reportEvent(JSON.parse(decodeURI(trytesToAscii(message)))));
      }

      return resolve(onFetchComplete());
    } catch (error) {
      console.log('MAM fetch error', error);
      return reject();
    }
  });

  return promise;
};