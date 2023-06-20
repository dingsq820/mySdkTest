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
exports.NetworkService = exports.NetworksChainId = void 0;
const async_mutex_1 = require("async-mutex");
const eth_query_1 = __importDefault(require("eth-query"));
const zero_1 = __importDefault(require("web3-provider-engine/zero"));
const AbstractService_1 = require("../core/AbstractService");
var NetworksChainId;
(function (NetworksChainId) {
    NetworksChainId["rpc"] = "";
    NetworksChainId["polygon"] = "137";
    NetworksChainId["mumbai"] = "80001";
})(NetworksChainId = exports.NetworksChainId || (exports.NetworksChainId = {}));
class NetworkService extends AbstractService_1.AbstractService {
    constructor() {
        super(...arguments);
        this.name = 'NetworkService';
        this.mutex = new async_mutex_1.Mutex();
    }
    initialize(config) {
        this.updateState({
            network: 'loading',
        });
        const ProviderConfig = {
            chainId: config === null || config === void 0 ? void 0 : config.chainId,
            engineParams: { pollingInterval: 12000 },
            nickname: config === null || config === void 0 ? void 0 : config.nickname,
            rpcUrl: config === null || config === void 0 ? void 0 : config.rpcTarget,
            ticker: config === null || config === void 0 ? void 0 : config.ticker,
        };
        this.provider = (0, zero_1.default)(ProviderConfig);
        this.provider.on('error', this.onNetworkError.bind(this));
        this.ethQuery = new eth_query_1.default(this.provider);
        this.updateNetwork();
    }
    onNetworkError() {
        const state = this.getState();
        state.network === 'loading' && this.updateNetwork();
    }
    updateNetwork() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.ethQuery || !this.ethQuery.sendAsync) {
                return;
            }
            const releaseLock = yield this.mutex.acquire();
            this.ethQuery.sendAsync({ method: 'net_version' }, (error, network) => {
                this.updateState({
                    network: error ? 'loading' : network,
                });
                releaseLock();
            });
        });
    }
}
exports.NetworkService = NetworkService;
exports.default = NetworkService;
//# sourceMappingURL=NetworkService.js.map