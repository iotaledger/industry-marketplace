export const getLocationFromMessage = message => {
    return message.frame && message.frame.location ? message.frame.location : null;
};


export const calculateDistance = (lat1, lon1, lat2, lon2) => {

    if ((lat1 === lat2) && (lon1 === lon2)) {
        return 0;
    }
    else {
        var R = 6371;
        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLon = (lon2 - lon1) * Math.PI / 180;
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        if (d > 1) {
            return Math.round(d) + "km";
        }
        else if (d <= 1) { return Math.round(d * 1000) + "m"; }
    }

}