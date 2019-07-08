import { asciiToTrytes, trytesToAscii } from '@iota/converter';
import { decodeNonASCII, encodeNonASCII } from './textHelper';

/**
 * Convert an object to Trytes.
 * @param obj The obj to encode.
 * @returns The encoded trytes value.
 */
export const toTrytes = (obj) => {
    const json = JSON.stringify(obj);
    const encoded = encodeNonASCII(json);
    return encoded ? asciiToTrytes(encoded) : '';
};

/**
 * Convert an object from Trytes.
 * @param trytes The trytes to decode.
 * @returns The decoded object.
 */
export const fromTrytes = (trytes) => {
    // Trim trailing 9s
    let trimmed = trytes.replace(/\9+$/, '');

    // And make sure it is even length (2 trytes per ascii char)
    if (trimmed.length % 2 === 1) {
        trimmed += '9';
    }

    const ascii = trytesToAscii(trimmed);
    return decodeNonASCII(ascii);
    // return json ? JSON.parse(json) : undefined;
};