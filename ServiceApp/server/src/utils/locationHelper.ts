import { encode, decode } from '@iota/area-codes';

export const getLocationFromMessage = message => {
    return message.frame && message.frame.location ? message.frame.location : null;
};

export const calculateDistance = (locObj1, locObj2) => {
    const lat1 = locObj1.latitude;
    const lat2 = locObj2.latitude;
    const lon1 = locObj1.longitude;
    const lon2 = locObj2.longitude;

    if ((lat1 === lat2) && (lon1 === lon2)) {
        return 0;
    } else {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;
        if (d > 1) {
            return `${Math.round(d)}`;
       // } else if (d <= 1) { 
         //   return `${Math.round(d * 1000)}m`; 
        }
    }
};


export const createCloseLocation = targetLocation => {
const {latitude, longitude} = decode(targetLocation)

const closeLat = Number(latitude) + Number((Math.random() * (0.5 - 0.0200) + 0.0200).toFixed(4))
const closeLong = Number(longitude) + Number((Math.random() * (0.5- 0.0200) + 0.0200).toFixed(4))

return encode( Number(closeLat), Number(closeLong) );

}