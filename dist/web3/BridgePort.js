"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletConnectPort = exports.WebviewPort = void 0;
const events_1 = require("events");
const MiddlewareUtil_1 = require("./MiddlewareUtil");
const WebviewScripts_1 = require("./WebviewScripts");
class WebviewPort extends events_1.EventEmitter {
    constructor(window, isMainFrame) {
        super();
        this.postMessage = (msg, origin = '*') => {
            const js = this._isMainFrame
                ? (0, WebviewScripts_1.JS_POST_MESSAGE_TO_PROVIDER)(msg, origin)
                : (0, WebviewScripts_1.JS_IFRAME_POST_MESSAGE_TO_PROVIDER)(msg, origin);
            if (this._window.webViewRef && this._window.webViewRef.current) {
                this._window && this._window.injectJavaScript(js);
            }
        };
        this._window = window;
        this._isMainFrame = isMainFrame;
    }
}
exports.WebviewPort = WebviewPort;
class WalletConnectPort extends events_1.EventEmitter {
    constructor(wcRequestActions, serviceManager) {
        super();
        this.postMessage = (msg) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
            try {
                if (((_a = msg === null || msg === void 0 ? void 0 : msg.data) === null || _a === void 0 ? void 0 : _a.method) === MiddlewareUtil_1.NOTIFICATION_NAMES.chainChanged) {
                    const selectedAddress = (_c = (_b = this.serviceManager) === null || _b === void 0 ? void 0 : _b.getServiceByName('PreferencesService').getSelectedAddress()) === null || _c === void 0 ? void 0 : _c.toLowerCase();
                    (_e = (_d = this._wcRequestActions) === null || _d === void 0 ? void 0 : _d.updateSession) === null || _e === void 0 ? void 0 : _e.call(_d, {
                        chainId: parseInt(msg.data.params.chainId, 16),
                        accounts: [selectedAddress],
                    });
                }
                else if (((_f = msg === null || msg === void 0 ? void 0 : msg.data) === null || _f === void 0 ? void 0 : _f.method) === MiddlewareUtil_1.NOTIFICATION_NAMES.accountsChanged) {
                    const chainId = (_h = (_g = this.serviceManager) === null || _g === void 0 ? void 0 : _g.getServiceByName('NetworkService').provider) === null || _h === void 0 ? void 0 : _h.chainId;
                    (_k = (_j = this._wcRequestActions) === null || _j === void 0 ? void 0 : _j.updateSession) === null || _k === void 0 ? void 0 : _k.call(_j, {
                        chainId: parseInt(chainId, 10),
                        accounts: msg.data.params,
                    });
                }
                else if (((_l = msg === null || msg === void 0 ? void 0 : msg.data) === null || _l === void 0 ? void 0 : _l.method) === MiddlewareUtil_1.NOTIFICATION_NAMES.unlockStateChanged) {
                    // WC DOESN'T NEED THIS EVENT
                }
                else if ((_m = msg === null || msg === void 0 ? void 0 : msg.data) === null || _m === void 0 ? void 0 : _m.error) {
                    (_p = (_o = this._wcRequestActions) === null || _o === void 0 ? void 0 : _o.rejectRequest) === null || _p === void 0 ? void 0 : _p.call(_o, {
                        id: msg.data.id,
                        error: msg.data.error,
                    });
                }
                else {
                    (_r = (_q = this._wcRequestActions) === null || _q === void 0 ? void 0 : _q.approveRequest) === null || _r === void 0 ? void 0 : _r.call(_q, {
                        id: msg.data.id,
                        result: msg.data.result,
                    });
                }
            }
            catch (e) {
                console.warn(e);
            }
        };
        this._wcRequestActions = wcRequestActions;
        this.serviceManager = serviceManager;
    }
}
exports.WalletConnectPort = WalletConnectPort;
//# sourceMappingURL=BridgePort.js.map