"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DidService = void 0;
const dw_did_sdk_1 = require("dw-did-sdk");
const AbstractService_1 = require("../core/AbstractService");
const DidModel_1 = __importDefault(require("./DidModel"));
const url_join_1 = __importDefault(require("./url-join/url-join"));
class DidService extends AbstractService_1.AbstractService {
    constructor() {
        super(...arguments);
        this.name = 'DidService';
    }
    initialize(config) {
        const selectCreator = config === null || config === void 0 ? void 0 : config.selectCreator;
        const urlOperation = config === null || config === void 0 ? void 0 : config.urlOperation;
        const urlResolve = config === null || config === void 0 ? void 0 : config.urlResolve;
        if (typeof urlOperation === 'string') {
            this.didManager = new dw_did_sdk_1.DidManager([
                new dw_did_sdk_1.IonDidCreaterWithChallenge((0, url_join_1.default)(urlOperation, 'operations'), (0, url_join_1.default)(urlOperation, 'proof-of-work-challenge')),
                new dw_did_sdk_1.IonDidCreaterNoRegistered(),
                new dw_did_sdk_1.IonDidCreaterNoChallenge((0, url_join_1.default)(urlOperation, 'operations')),
            ], [new dw_did_sdk_1.IonDidResolver(urlResolve)]);
            if (selectCreator != null) {
                this.didManager.setCreaterDefault(selectCreator);
            }
        }
    }
    createDid(primaryKey) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.didManager) {
                return;
            }
            // DID発行
            try {
                const didObject = yield this.didManager.createDid({
                    signingKeyId: primaryKey,
                });
                const resp = DidModel_1.default.createByDidObject(didObject);
                if (resp) {
                    const { scheme, method, didSuffix } = resp;
                    let did;
                    if (scheme && method && didSuffix) {
                        did = `${scheme}:${method}:${didSuffix}`;
                    }
                    // DID Modelを保存
                    this.updateState({
                        didModel: resp,
                        did,
                    });
                }
                // eslint-disable-next-line consistent-return
                return resp;
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    resolveDid(did) {
        return __awaiter(this, void 0, void 0, function* () {
            const { didModel } = this.getState();
            if (!this.didManager) {
                return '';
            }
            const resolveDid = yield this.didManager.resolveDid(did);
            const resolveResponse = JSON.stringify(resolveDid, null, 2);
            if (didModel === null || didModel === void 0 ? void 0 : didModel.published) {
                if (resolveDid.didDocumentMetadata.method.published) {
                    // publishedの更新
                    didModel.published = true;
                    this.updateState({
                        didModel,
                    });
                }
            }
            return resolveResponse;
        });
    }
    clearDid() {
        this.updateState({ didModel: null, did: null });
    }
    /**
     * did
     * @param did
     */
    setDid(did) {
        this.updateState({ did });
    }
}
exports.DidService = DidService;
DidService.RESERVE_ID = {
    RECOVERY: '@RECOVERY',
    UPDATE: '@UPDATE',
};
exports.default = DidService;
//# sourceMappingURL=DidService.js.map