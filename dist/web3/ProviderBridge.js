"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderBridge = void 0;
const providerAsMiddleware_1 = __importDefault(require("eth-json-rpc-middleware/providerAsMiddleware"));
const events_1 = require("events");
const json_rpc_engine_1 = require("json-rpc-engine");
const json_rpc_middleware_stream_1 = require("json-rpc-middleware-stream");
const pump_1 = __importDefault(require("pump"));
const swappable_obj_proxy_1 = require("swappable-obj-proxy");
const url_parse_1 = __importDefault(require("url-parse"));
const NetworkService_1 = require("../network/NetworkService");
const BridgePort_1 = require("./BridgePort");
const ConnectionStream_1 = require("./ConnectionStream");
const MiddlewareUtil_1 = require("./MiddlewareUtil");
class ProviderBridge extends events_1.EventEmitter {
    constructor({ webview, url, rpcMiddleware, isMainFrame, isWalletConnect, requestActions, getApprovedHosts, serviceManager, }) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        super();
        this.sendStateUpdate = () => {
            this.emit('update');
        };
        this.onMessage = (msg) => {
            this.port.emit('message', { name: msg.name, data: msg.data });
        };
        this.onDisconnect = () => {
            var _a, _b;
            this.disconnected = true;
            (_a = this.serviceManager) === null || _a === void 0 ? void 0 : _a.getServiceByName('NetworkService').adapter.removeStateListener(this.sendStateUpdate);
            (_b = this.serviceManager) === null || _b === void 0 ? void 0 : _b.getServiceByName('PreferencesService').adapter.removeStateListener(this.sendStateUpdate);
            this.port.emit('disconnect', { name: this.port.name, data: null });
        };
        this.url = url;
        this.hostname = new url_parse_1.default(url).hostname;
        this.isMainFrame = isMainFrame;
        this.isWalletConnect = isWalletConnect;
        this._webviewRef = webview && webview.current;
        this.disconnected = false;
        this.getApprovedHosts = getApprovedHosts;
        this.rpcMiddleware = rpcMiddleware;
        this.serviceManager = serviceManager;
        const provider = (_a = this.serviceManager) === null || _a === void 0 ? void 0 : _a.getServiceByName('NetworkService').provider;
        // provider and block tracker proxies - because the network changes
        this._providerProxy = null;
        this.setProvider({ provider });
        this.port = this.isWalletConnect
            ? new BridgePort_1.WalletConnectPort(requestActions, this.serviceManager)
            : new BridgePort_1.WebviewPort(this._webviewRef, isMainFrame);
        this.engine = null;
        this.chainIdSent = (_c = (_b = this.serviceManager) === null || _b === void 0 ? void 0 : _b.getServiceByName('NetworkService').provider) === null || _c === void 0 ? void 0 : _c.chainId;
        this.networkVersionSent = (_d = this.serviceManager) === null || _d === void 0 ? void 0 : _d.getServiceByName('NetworkService').NetworkType;
        // for WalletConnect
        this.addressSent = (_f = (_e = this.serviceManager) === null || _e === void 0 ? void 0 : _e.getServiceByName('PreferencesService').getSelectedAddress()) === null || _f === void 0 ? void 0 : _f.toLowerCase();
        const portStream = new ConnectionStream_1.ConnectionStream(this.port, url);
        // setup multiplexing
        const mux = (0, ConnectionStream_1.setupMultiplex)(portStream);
        // connect features
        this.setupProviderConnection(mux.createStream(isWalletConnect ? 'walletconnect-provider' : 'alphaUWallet-provider'));
        (_g = this.serviceManager) === null || _g === void 0 ? void 0 : _g.getServiceByName('NetworkService').adapter.addStateListener(this.sendStateUpdate);
        (_h = this.serviceManager) === null || _h === void 0 ? void 0 : _h.getServiceByName('PreferencesService').adapter.addStateListener(this.sendStateUpdate);
        (_j = this.serviceManager) === null || _j === void 0 ? void 0 : _j.getServiceByName('AccountService').onLock(this.onLock.bind(this));
        (_k = this.serviceManager) === null || _k === void 0 ? void 0 : _k.getServiceByName('AccountService').onUnlock(this.onUnlock.bind(this));
        this.on('update', this.onStateUpdate);
    }
    setProvider({ provider }) {
        // update or intialize proxies
        if (this._providerProxy) {
            this._providerProxy.setTarget(provider);
        }
        else {
            this._providerProxy = (0, swappable_obj_proxy_1.createSwappableProxy)(provider);
        }
        // set new provider
        this.provider = provider;
    }
    onUnlock() {
        // TODO UNSUBSCRIBE EVENT INSTEAD
        if (this.disconnected)
            return;
        this.sendNotification({
            method: MiddlewareUtil_1.NOTIFICATION_NAMES.unlockStateChanged,
            params: true,
        });
    }
    onLock() {
        // TODO UNSUBSCRIBE EVENT INSTEAD
        if (this.disconnected)
            return;
        this.sendNotification({
            method: MiddlewareUtil_1.NOTIFICATION_NAMES.unlockStateChanged,
            params: false,
        });
    }
    getProviderNetworkState({ network }) {
        var _a, _b, _c;
        const networkType = (_b = (_a = this.serviceManager) === null || _a === void 0 ? void 0 : _a.getServiceByName('NetworkService').provider) === null || _b === void 0 ? void 0 : _b.type;
        const networkProvider = (_c = this.serviceManager) === null || _c === void 0 ? void 0 : _c.getServiceByName('NetworkService').provider;
        const isInitialNetwork = networkType;
        let chainId;
        if (isInitialNetwork) {
            chainId = NetworkService_1.NetworksChainId[networkType];
        }
        else if (networkType === 'rpc') {
            chainId = networkProvider.chainId;
        }
        if (chainId && !chainId.startsWith('0x')) {
            // Convert to hex
            chainId = `0x${parseInt(chainId, 10).toString(16)}`;
        }
        const result = {
            networkVersion: network,
            chainId,
        };
        return result;
    }
    onStateUpdate(memState) {
        var _a;
        const provider = (_a = this.serviceManager) === null || _a === void 0 ? void 0 : _a.getServiceByName('NetworkService').provider;
        this.setProvider({ provider });
        if (!memState) {
            memState = this.getState();
        }
        const publicState = this.getProviderNetworkState(memState);
        // Check if update already sent
        if (this.chainIdSent !== publicState.chainId &&
            this.networkVersionSent !== publicState.networkVersion &&
            publicState.networkVersion !== 'loading') {
            this.chainIdSent = publicState.chainId;
            this.networkVersionSent = publicState.networkVersion;
            this.sendNotification({
                method: MiddlewareUtil_1.NOTIFICATION_NAMES.chainChanged,
                params: publicState,
            });
        }
        // ONLY NEEDED FOR WC FOR NOW, THE BROWSER HANDLES THIS NOTIFICATION BY ITSELF
        if (this.isWalletConnect) {
            if (this.addressSent !== memState.selectedAddress) {
                this.addressSent = memState.selectedAddress;
                this.sendNotification({
                    method: MiddlewareUtil_1.NOTIFICATION_NAMES.accountsChanged,
                    params: [memState.selectedAddress],
                });
            }
        }
    }
    isUnlocked() {
        var _a;
        return (_a = this.serviceManager) === null || _a === void 0 ? void 0 : _a.getServiceByName('AccountService').isUnlocked();
    }
    getProviderState() {
        const memState = this.getState();
        return Object.assign({ isUnlocked: this.isUnlocked() }, this.getProviderNetworkState(memState));
    }
    /**
     * A method for serving our ethereum provider over a given stream.
     * @param {*} outStream - The stream to provide over.
     */
    setupProviderConnection(outStream) {
        this.engine = this.setupProviderEngine();
        // setup connection
        const providerStream = (0, json_rpc_middleware_stream_1.createEngineStream)({ engine: this.engine });
        (0, pump_1.default)(outStream, providerStream, outStream, (err) => {
            // handle any middleware cleanup
            this.engine._middleware.forEach((mid) => {
                if (mid.destroy && typeof mid.destroy === 'function') {
                    mid.destroy();
                }
            });
            if (err)
                console.log('Error with provider stream conn', err);
        });
    }
    /**
     * A method for creating a provider that is safely restricted for the requesting domain.
     **/
    setupProviderEngine() {
        const origin = this.hostname;
        // setup json rpc engine stack
        const engine = new json_rpc_engine_1.JsonRpcEngine();
        const provider = this._providerProxy;
        // metadata
        engine.push((0, MiddlewareUtil_1.createOriginMiddleware)({ origin }));
        engine.push((0, MiddlewareUtil_1.createLoggerMiddleware)());
        // user-facing RPC methods
        engine.push(this.rpcMiddleware({
            hostname: this.hostname,
            getProviderState: this.getProviderState.bind(this),
        }));
        // forward to digitalwallet primary provider
        engine.push((0, providerAsMiddleware_1.default)(provider));
        return engine;
    }
    sendNotification(payload) {
        this.engine && this.engine.emit('notification', payload);
    }
    /**
     * The state of the sdk
     *
     * @returns {Object} status
     */
    getState() {
        var _a, _b, _c, _d, _e, _f;
        const vault = (_b = (_a = this.serviceManager) === null || _a === void 0 ? void 0 : _a.getServiceByName('AccountService')) === null || _b === void 0 ? void 0 : _b.vault;
        const network = (_d = (_c = this.serviceManager) === null || _c === void 0 ? void 0 : _c.getServiceByName('NetworkService').provider) === null || _d === void 0 ? void 0 : _d.type;
        const selectedAddress = (_f = (_e = this.serviceManager) === null || _e === void 0 ? void 0 : _e.getServiceByName('PreferencesService').getSelectedAddress()) === null || _f === void 0 ? void 0 : _f.toLowerCase();
        return {
            isInitialized: !!vault,
            isUnlocked: true,
            network,
            selectedAddress,
        };
    }
}
exports.ProviderBridge = ProviderBridge;
exports.default = ProviderBridge;
//# sourceMappingURL=ProviderBridge.js.map