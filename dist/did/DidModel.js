"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dw_did_sdk_1 = require("dw-did-sdk");
class DidModel extends dw_did_sdk_1.DidObject {
    constructor(scheme, method, didSuffix, longFormSuffixData, signingKeyId, published, keys) {
        super(scheme, method, didSuffix, longFormSuffixData, signingKeyId, published, keys);
        this.id = DidModel.ID;
    }
    static createByDidObject(didObject) {
        return new DidModel(didObject.scheme, didObject.method, didObject.didSuffix, didObject.longFormSuffixData, didObject.signingKeyId, didObject.published, didObject.keys);
    }
}
DidModel.ID = 'onlyid';
exports.default = DidModel;
//# sourceMappingURL=DidModel.js.map