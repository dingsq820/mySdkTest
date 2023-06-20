"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletConnectService = void 0;
const client_1 = __importDefault(require("@walletconnect/client"));
const utils_1 = require("@walletconnect/utils");
/**
 * Controller responsible for managing walletConnect
 */
class WalletConnectService {
    /**
     * Creates a WalletConnectService instance.
     * @param connectorOpts - wallet connect options.
     */
    constructor(connectorOpts) {
        this.walletConnector = new client_1.default(connectorOpts);
    }
    /**
     * Subscribe to session requests
     * @param callback - Handle Session Request
     */
    onSessionRequest(callback) {
        this.walletConnector.on('session_request', callback);
    }
    /**
     * Subscribe to call requests
     * @param callback - Handle Call Request
     */
    onCallRequest(callback) {
        this.walletConnector.on('call_request', callback);
    }
    /**
     * Subscribe to disconnect
     * @param callback - Handle disconnect
     */
    onDisconnect(callback) {
        this.walletConnector.on('disconnect', callback);
    }
    /**
     * Subscribe to update session
     * @param callback - Handle update session
     */
    onSessionUpdate(callback) {
        this.walletConnector.on('session_update', callback);
    }
    /**
     * Subscribe to approve request
     * @param response - json rpc response success
     */
    approveRequest(response) {
        this.walletConnector.approveRequest(response);
    }
    /**
     * Subscribe to reject request
     * @param response - json rpc response error
     */
    rejectRequest(response) {
        this.walletConnector.rejectRequest(response);
    }
    /**
     * Subscribe to update session
     * @param sessionStatus - session status
     */
    updateSession(sessionStatus) {
        this.walletConnector.updateSession(sessionStatus);
    }
    /**
     * Subscribe to approve session
     * @param sessionStatus - session status
     */
    approveSession(sessionStatus) {
        this.walletConnector.approveSession(sessionStatus);
    }
    /**
     * Subscribe to reject session
     * @param sessionError - session error
     */
    rejectSession(sessionError) {
        this.walletConnector.rejectSession(sessionError);
    }
    /**
     * Subscribe to kill session
     */
    killSession() {
        this.walletConnector.killSession();
    }
    /**
     * Subscribe to get session
     */
    getSession() {
        return this.walletConnector.session;
    }
    /**
     * Subscribe to get connect
     */
    getConnected() {
        return this.walletConnector.connected;
    }
    /**
     * parse wallet connect uri
     * @param str - wallet connect uri
     * @returns parse uri result
     */
    static parseWalletConnectUri(str) {
        return (0, utils_1.parseWalletConnectUri)(str);
    }
}
exports.WalletConnectService = WalletConnectService;
exports.default = WalletConnectService;
//# sourceMappingURL=WalletConnectService.js.map