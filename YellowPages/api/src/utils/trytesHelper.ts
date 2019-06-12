import { asciiToTrytes, trytesToAscii } from '@iota/converter';
import { TextHelper } from './textHelper';

/**
 * Helper functions for use with trytes.
 */
export class TrytesHelper {
    /**
     * Convert an object to Trytes.
     * @param obj The obj to encode.
     * @returns The encoded trytes value.
     */
    public static toTrytes(obj) {
        const json = JSON.stringify(obj);
        const encoded = TextHelper.encodeNonASCII(json);
        return encoded ? asciiToTrytes(encoded) : '';
    }

    /**
     * Convert an object from Trytes.
     * @param trytes The trytes to decode.
     * @returns The decoded object.
     */
    public static fromTrytes(trytes) {
        // Trim trailing 9s
        let trimmed = trytes.replace(/\9+$/, '');

        // And make sure it is even length (2 trytes per ascii char)
        if (trimmed.length % 2 === 1) {
            trimmed += '9';
        }

        const ascii = trytesToAscii(trimmed);
        const json = TextHelper.decodeNonASCII(ascii);

        return json ? JSON.parse(json) : undefined;
    }
}
