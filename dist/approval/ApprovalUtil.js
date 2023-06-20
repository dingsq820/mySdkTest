"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hexToText = exports.normalizeMessageData = exports.validateSignMessageData = exports.isValidHexAddress = void 0;
const ethereumjs_util_1 = require("ethereumjs-util");
const hexRe = /^[0-9A-Fa-f]+$/gu;
/**
 * Validates that the input is a hex address.
 *
 * @param address - Input address.
 * @param options - The validation options.
 * @param options.allowNonPrefixed - If true will first ensure '0x' is prepended to the string.
 * @returns Whether or not the input is a valid hex address.
 */
function isValidHexAddress(address, { allowNonPrefixed = true } = {}) {
    const addressToCheck = allowNonPrefixed ? (0, ethereumjs_util_1.addHexPrefix)(address) : address;
    if (!(0, ethereumjs_util_1.isHexString)(addressToCheck)) {
        return false;
    }
    return (0, ethereumjs_util_1.isValidAddress)(addressToCheck);
}
exports.isValidHexAddress = isValidHexAddress;
/**
 * Validates a PersonalMessageParams.
 */
function validateSignMessageData(messageData) {
    const { from, data } = messageData;
    if (!from || typeof from !== 'string' || !isValidHexAddress(from)) {
        throw new Error(`Invalid "from" address: ${from} must be a valid string.`);
    }
    if (!data || typeof data !== 'string') {
        throw new Error(`Invalid message "data": ${data} must be a valid string.`);
    }
}
exports.validateSignMessageData = validateSignMessageData;
/**
 * Converts rawmessageData buffer data to a hex,
 * or just returns the data if it is already formatted as a hex.
 *
 * @param data - The buffer data to convert to a hex.
 * @returns A hex string conversion of the buffer data.
 */
function normalizeMessageData(data) {
    try {
        const stripped = (0, ethereumjs_util_1.stripHexPrefix)(data);
        if (stripped.match(hexRe)) {
            return (0, ethereumjs_util_1.addHexPrefix)(stripped);
        }
    }
    catch (e) {
        /* error ignore next */
    }
    return (0, ethereumjs_util_1.bufferToHex)(Buffer.from(data, 'utf8'));
}
exports.normalizeMessageData = normalizeMessageData;
/**
 * Converts hex data to human readable string.
 *
 * @param hex - The hex string to convert to string.
 * @returns A human readable string conversion.
 */
function hexToText(hex) {
    try {
        const stripped = (0, ethereumjs_util_1.stripHexPrefix)(hex);
        const buff = Buffer.from(stripped, 'hex');
        return buff.toString('utf8');
    }
    catch (e) {
        /* ignore next */
        return hex;
    }
}
exports.hexToText = hexToText;
//# sourceMappingURL=ApprovalUtil.js.map