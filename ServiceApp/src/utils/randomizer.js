import { encode } from '@iota/area-codes';
import format from 'date-fns/format';

const locationBoundaries = {
    lat: {
        min: 47,
        max: 53
    },
    lon: {
        min: 6,
        max: 14
    }
};

const material = [
    'Aluminium',
    'Bronze',
    'Chrom',
    'Edelstahl',
    'Eisen',
    'Gold',
    'Kupfer',
    'Messing',
    'Nickel',
    'Silber',
    'Titan',
    'Kobalt'
];

const color = [
    'Braun',
    'Beige',
    'Grau',
    'Schwarz',
    'Gelb',
    'Rot',
    'Orange',
    'Gruen',
    'Blau',
    'Weiss'
];

const integerMaxValue = 10;
const decimalMaxValue = 10;
const randomTextLength = 10;

const getRandomInt = max => Math.floor(Math.random() * Math.floor(max));

export const getRandomLocation = () => {
    const lat = locationBoundaries.lat.min + getRandomInt(locationBoundaries.lat.max - locationBoundaries.lat.min) + Math.random();
    const lon = locationBoundaries.lon.min + getRandomInt(locationBoundaries.lon.max - locationBoundaries.lon.min) + Math.random();
    return `${lat.toFixed(7)}, ${lon.toFixed(7)}`;
};

const getRandomInteger = () => {
    return 1 + getRandomInt(integerMaxValue);
};

const getRandomDecimal = () => {
    return Number((getRandomInt(decimalMaxValue) + Math.random()).toFixed(2, 10));
};

const getRandomBoolean = () => {
    return Boolean(getRandomInt(2));
};

const getRandomColor = () => {
    return color[getRandomInt(color.length)];
};

const getRandomMaterial = () => {
    return material[getRandomInt(material.length)];
};

export const getRandomTimestamp = () => {
    const randomStartHour = getRandomInt(10) * 3600000 + getRandomInt(5) * 3600000 + 3600000;
    const randomEndHour = getRandomInt(10) * 3600000 + 3600000;
    const valueStart = Date.now() + randomStartHour;
    const valueEnd = valueStart + randomEndHour;
    return [valueStart, valueEnd];
};

const getRandomText = () => {
    const charset = 'abcdefghijklmnopqrstuvwxyz-';
    return Array.from(new Array(randomTextLength), () => charset[getRandomInt(charset.length)]).join('');
};

export const generateRandomSubmodelValues = submodel => {
    const randomSubmodel = submodel.map(item => {
        switch (item.valueType) {
            case 'decimal':
            case 'float':
                return { ...item, value: getRandomDecimal() };

            case 'int':
            case 'integer':
            case 'time':
                return { ...item, value: getRandomInteger() };

            case 'dateTimeStamp':
                return { ...item, value: getRandomTimestamp()[0] };
            
            case 'date':
                return { ...item, value: format(getRandomTimestamp()[0], 'DD MMMM, YYYY H:mm a ') };
      
            case 'boolean':
                return { ...item, value: getRandomBoolean() };
      
            case 'string':
            default: {
                switch (item.idShort) {
                    case 'ort':
                    case 'location':
                    case 'target location':
                    case 'starting point':
                    case 'destination':
                    case 'departure':
                        return { ...item, value: getRandomLocation() };
                    case 'material':
                        return { ...item, value: getRandomMaterial() };
                    case 'farbe':
                        return { ...item, value: getRandomColor() };
                    default:
                        return { ...item, value: getRandomText() };
                };
            }
        }
    })
    return randomSubmodel;
}