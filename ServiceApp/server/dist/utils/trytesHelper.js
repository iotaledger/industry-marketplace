"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const converter_1 = require("@iota/converter");
const textHelper_1 = require("./textHelper");
/**
 * Helper functions for use with trytes.
 */
class TrytesHelper {
    /**
     * Convert an object to Trytes.
     * @param obj The obj to encode.
     * @returns The encoded trytes value.
     */
    static toTrytes(obj) {
        const json = JSON.stringify(obj);
        const encoded = textHelper_1.TextHelper.encodeNonASCII(json);
        return encoded ? converter_1.asciiToTrytes(encoded) : '';
    }
    /**
     * Convert an object from Trytes.
     * @param trytes The trytes to decode.
     * @returns The decoded object.
     */
    static fromTrytes(trytes) {
        // Trim trailing 9s
        let trimmed = trytes.replace(/\9+$/, '');
        // And make sure it is even length (2 trytes per ascii char)
        if (trimmed.length % 2 === 1) {
            trimmed += '9';
        }
        const ascii = converter_1.trytesToAscii(trimmed);
        return textHelper_1.TextHelper.decodeNonASCII(ascii);
        // return json ? JSON.parse(json) : undefined;
    }
}
exports.TrytesHelper = TrytesHelper;
