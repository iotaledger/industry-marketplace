import { trytesToAscii } from '@iota/converter';
import { composeAPI } from '@iota/client-load-balancer';
import { mamFetchAll } from '@iota/mam.js';
import { ServiceFactory } from '../factories/serviceFactory';

const loadBalancerSettings = ServiceFactory.get('load-balancer-settings');
const iota = composeAPI(loadBalancerSettings);

export const fetch = (root, key, reportEvent, onFetchComplete) => {
  if (!root) return;
  const promise = new Promise(async (resolve, reject) => {
    try {
      const convertAndReport = event => reportEvent(JSON.parse(decodeURI(trytesToAscii(event))));

      const fetched = await mamFetchAll(iota, root, 'restricted', key, 20);
          
      if (fetched && fetched.length > 0) {
          for (let i = 0; i < fetched.length; i++) {
            convertAndReport(JSON.parse(trytesToAscii(fetched[i].message)));
          }
      }

      return resolve(onFetchComplete());
    } catch (error) {
      console.log('MAM fetch error', error);
      return reject();
    }
  });

  return promise;
};