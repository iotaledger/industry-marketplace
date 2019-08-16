const axios = require('axios');
const iotaAreaCodes = require('@iota/area-codes');
const { getGoogleMapsApiKey } = require('./firebase');

const addressToGPS = async address => {
    try {
      const apiKey = await getGoogleMapsApiKey();
      const options = {
        method: 'GET',
        headers: { 'content-type': 'application/json; charset=UTF-8' },
        url: `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`
      };
      const result = await axios(options);
      const { lat, lng } = result.data.results[0].geometry.location;
      return `${lat.toFixed(7)}, ${lng.toFixed(7)}`;
    } catch (error) {
      console.error('addressToIac error:', error);
    }
    return null;
  }

module.exports = {
  addressToGPS
}
