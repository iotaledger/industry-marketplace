/**
 * Decode escaped Non ASCII characters.
 * @param value The value to decode.
 * @returns The decoded value.
 */
export const decodeNonASCII = (value) => {
    return value ? value.replace(/\\u([\d\w]{4})/gi, (match, grp) => String.fromCharCode(parseInt(grp, 16))) : undefined;
};
