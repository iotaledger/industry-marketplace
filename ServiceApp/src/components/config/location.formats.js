import axios from 'axios';
import { addressApi } from '../../config.json';

const locationFormats = [
  {
    name: 'GPS Coordinates',
    action: async (sendMessage, gps, props) => await sendMessage({ gps, ...props })
  },
  {
    name: 'Address',
    action: async (sendMessage, address, props) => {
      // convert to GPS
      const res = await axios.get(`${addressApi}?address=${encodeURI(address)}`);
      const gps = res.data;
      return await sendMessage({ gps, ...props });
    }
  }
]

export default locationFormats;
