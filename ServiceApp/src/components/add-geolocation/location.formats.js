import axios from 'axios'
import { addressApi } from '../../config.json';

const locationFormats = [
  {
    name: 'Area Code',
    action: async (sendMessage, areaCode) => await sendMessage({ areaCode })
  },
  {
    name: 'Address',
    action: async (sendMessage, address) => {
      // convert to area code
      const res = await axios.get(`${addressApi}?address=${encodeURI(address)}`);
      const areaCode = res.data;
      return await sendMessage(areaCode ? { areaCode } : null);
    }
    },
  {
    name: 'GPS Coordinates',
    action: async (sendMessage, gps) => {
      return await sendMessage({ gps })
    }
  }
]

export default locationFormats
