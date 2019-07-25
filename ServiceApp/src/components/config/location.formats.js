import axios from 'axios'
import { addressApi } from '../../config.json';

const locationFormats = [
  {
    name: 'Area Code',
    action: async (sendMessage, areaCode, props) => await sendMessage({ areaCode, ...props })
  },
  {
    name: 'Address',
    action: async (sendMessage, address, props) => {
      // convert to area code
      const res = await axios.get(`${addressApi}?address=${encodeURI(address)}`);
      const areaCode = res.data;
      return await sendMessage({ areaCode: areaCode || null, ...props });
    }
    },
  {
    name: 'GPS Coordinates',
    action: async (sendMessage, gps, props) => {
      return await sendMessage({ gps, ...props })
    }
  }
]

export default locationFormats
