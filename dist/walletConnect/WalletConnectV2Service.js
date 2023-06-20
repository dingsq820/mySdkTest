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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletConnectV2Service = void 0;
const core_1 = require("@walletconnect/core");
const web3wallet_1 = require("@walletconnect/web3wallet");
class WalletConnectV2Service {
    /**
     * Creates a WalletConnectV2Service instance.
     * @param connectorOpts - wallet connect options.
     */
    constructor(projectId, relayUrl, metadata) {
        this.projectId = projectId;
        this.relayUrl = relayUrl;
        this.metadata = metadata;
    }
    /**
     * Create a web3 wallet client.
     */
    createWeb3WalletClient() {
        return __awaiter(this, void 0, void 0, function* () {
            const core = new core_1.Core({
                projectId: this.projectId,
                relayUrl: this.relayUrl,
            });
            const opts = {
                core,
                metadata: this.metadata,
            };
            this.web3Wallet = yield web3wallet_1.Web3Wallet.init(opts);
        });
    }
    /**
     * Get a web3 wallet client.
     * @returns
     */
    getWeb3WalletClient() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.web3Wallet;
        });
    }
    /**
     * Pari.
     * @param wcuri a wallet connect uri.
     * @returns pair result.
     */
    pair(wcuri) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const pairingData = yield ((_a = this.web3Wallet) === null || _a === void 0 ? void 0 : _a.core.pairing.pair({ uri: wcuri }));
            return pairingData;
        });
    }
    /**
     * Subscribe to session proposal.
     * @param callback - Handle Call Request
     */
    onSessionProposal(callback) {
        var _a;
        (_a = this.web3Wallet) === null || _a === void 0 ? void 0 : _a.on('session_proposal', callback);
    }
    /**
     * Subscribe to session request
     * @param callback - Handle Call Request
     */
    onSessionRequest(callback) {
        var _a;
        (_a = this.web3Wallet) === null || _a === void 0 ? void 0 : _a.on('session_request', callback);
    }
    /**
     * Subscribe to session delete
     * @param callback - Handle Call Request
     */
    onSessionDelete(callback) {
        var _a;
        (_a = this.web3Wallet) === null || _a === void 0 ? void 0 : _a.on('session_delete', callback);
    }
    /**
     * Subscribe to approve session
     * @param params - approve info.
     */
    approveSession(params) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const sessionData = yield ((_a = this.web3Wallet) === null || _a === void 0 ? void 0 : _a.approveSession(params));
            return sessionData;
        });
    }
    /**
     * Subscribe to reject session
     * @param params - reject info.
     */
    rejectSession(params) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.web3Wallet) === null || _a === void 0 ? void 0 : _a.rejectSession(params));
        });
    }
    updateSession(params) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.web3Wallet) === null || _a === void 0 ? void 0 : _a.updateSession(params));
        });
    }
    /**
     * Subscribe to disconnect session
     * @param params - disconnect session info.
     */
    disconnectSession(params) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.web3Wallet) === null || _a === void 0 ? void 0 : _a.disconnectSession(params));
        });
    }
    respondSessionRequest(params) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.web3Wallet) === null || _a === void 0 ? void 0 : _a.respondSessionRequest(params));
        });
    }
    /**
     * Get the active sessions.
     * @returns
     */
    getActiveSessions() {
        var _a;
        const sessions = (_a = this.web3Wallet) === null || _a === void 0 ? void 0 : _a.getActiveSessions();
        if (sessions) {
            return Object.values(sessions);
        }
        return sessions;
    }
    /**
     * Get the session by topic.
     * @param topic
     * @returns
     */
    getCurrentSessionByTopic(topic) {
        const sessions = this.getActiveSessions();
        if (sessions && topic) {
            const currentSession = sessions.find((session) => session.topic === topic);
            const { expiry } = currentSession !== null && currentSession !== void 0 ? currentSession : { expiry: 0 };
            if (expiry) {
                if (new Date(expiry * 1000) < new Date()) {
                    return undefined;
                }
            }
            return currentSession;
        }
        return undefined;
    }
    /**
     * emit session event.
     * @param params
     */
    emitSessionEvent(params) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.web3Wallet) === null || _a === void 0 ? void 0 : _a.emitSessionEvent(params));
        });
    }
    /**
     * disconnect all sessions.
     */
    disconnectAllSessions(reason) {
        return __awaiter(this, void 0, void 0, function* () {
            const sessions = this.getActiveSessions();
            if (sessions && sessions.length > 0) {
                sessions.forEach((session) => __awaiter(this, void 0, void 0, function* () {
                    const params = { topic: session.topic, reason };
                    yield this.disconnectSession(params);
                }));
            }
        });
    }
}
exports.WalletConnectV2Service = WalletConnectV2Service;
exports.default = WalletConnectV2Service;
//# sourceMappingURL=WalletConnectV2Service.js.map