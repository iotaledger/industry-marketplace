import { trytesToAscii } from '@iota/converter';
import { decodeNonASCII } from './textHelper';

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
