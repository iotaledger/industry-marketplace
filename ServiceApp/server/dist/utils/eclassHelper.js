"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Helper functions for eCl@ss IRDIs and lookup tables.
 */
class EClassHelper {
    /**
     * Extract capital letter which follows the SEMARKET tag and specifies the message type
     * @param tag The tag to process.
     * @returns Found message type.
     */
    static extractMessageType(tag) {
        const regex = /(?<=SEMARKET)([A-C])/gi; // change to [A-D] to support the whole range of types
        const match = tag.match(regex);
        const map = {
            A: 'callForProposal',
            B: 'proposal',
            C: 'acceptProposal'
            // D: 'rejectProposal',
            // E: 'informConfirm'
        };
        if (match !== null && match.length >= 1) {
            return map[match[0]] || null;
        }
        return null;
    }
}
exports.EClassHelper = EClassHelper;
