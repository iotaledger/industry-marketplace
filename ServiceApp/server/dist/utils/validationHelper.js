"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Helper functions for validating input.
 */
class ValidationHelper {
    /**
     * Does the string have some content.
     * @param str The string to validate.
     * @param name The parameter name.
     */
    static string(str, name) {
        if (str === undefined || str === null || str.trim().length === 0) {
            throw new Error(`The parameter '${name}' has an invalid value.`);
        }
    }
    /**
     * Does the number have a value.
     * @param num The number to validate.
     * @param name The parameter name.
     */
    static number(num, name) {
        if (num === undefined || num === null || typeof num !== 'number') {
            throw new Error(`The parameter '${name}' has an invalid value.`);
        }
    }
    /**
     * Is the value of one the specified items.
     * @param val The value to validate.
     * @param options The possible options.
     * @param name The parameter name.
     */
    static oneOf(val, options, name) {
        if (options.indexOf(val) < 0) {
            throw new Error(`The parameter '${name}' has an invalid value.`);
        }
    }
    /**
     * Is the value trytes.
     * @param str The string to validate.
     * @param length The length to match.
     * @param name The parameter name.
     */
    static trytes(str, length, name) {
        if (!new RegExp(`^[A-Z9]{${length}}$`).test(str)) {
            throw new Error(`The parameter '${name}' has an invalid value.`);
        }
    }
}
exports.ValidationHelper = ValidationHelper;
