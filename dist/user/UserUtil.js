"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toChecksumHexAddress = void 0;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const ethereumjs_util_1 = require("ethereumjs-util");
/**
 * Convert an address to a checksummed hexidecimal address.
 *
 * @param address - The address to convert.
 * @returns A 0x-prefixed hexidecimal checksummed address.
 */
// eslint-disable-next-line import/prefer-default-export
function toChecksumHexAddress(address) {
    const hexPrefixed = (0, ethereumjs_util_1.addHexPrefix)(address);
    if (!(0, ethereumjs_util_1.isHexString)(hexPrefixed)) {
        return hexPrefixed;
    }
    return (0, ethereumjs_util_1.toChecksumAddress)(hexPrefixed);
}
exports.toChecksumHexAddress = toChecksumHexAddress;
//# sourceMappingURL=UserUtil.js.map