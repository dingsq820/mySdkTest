"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApprovalService = void 0;
const eth_rpc_errors_1 = require("eth-rpc-errors");
const events_1 = require("events");
const uuid_1 = require("uuid");
const AbstractService_1 = require("../core/AbstractService");
const ApprovalUtil_1 = require("./ApprovalUtil");
const serviceName = 'ApprovalService';
const getAlreadyPendingMessage = (origin, type) => `Request of type '${type}' already pending for origin ${origin}. Please wait.`;
const getDefaultState = () => ({
    pendingApprovals: {},
    pendingApprovalCount: 0,
    unapprovedMessages: {},
    unapprovedMessagesCount: 0,
    unapprovedTypeMessages: {},
    unapprovedTypeMessagesCount: 0,
});
class ApprovalService extends AbstractService_1.AbstractService {
    constructor() {
        super(...arguments);
        this.name = serviceName;
        this._approvals = new Map();
        this._origins = new Map();
        /**
         * message event instance
         */
        this.hub = new events_1.EventEmitter();
        this.messages = [];
        this.typeMessages = [];
    }
    initialize(config, state) {
        this.updateState(Object.assign(Object.assign({}, getDefaultState()), state));
    }
    _isEmptyOrigin(origin) {
        var _a;
        return !((_a = this._origins.get(origin)) === null || _a === void 0 ? void 0 : _a.size);
    }
    _validateAddParams(id, origin, type, requestData) {
        let errorMessage = null;
        if (!id || typeof id !== 'string') {
            errorMessage = 'Must specify non-empty string id.';
        }
        else if (this._approvals.has(id)) {
            errorMessage = `Approval request with id '${id}' already exists.`;
        }
        else if (!origin || typeof origin !== 'string') {
            errorMessage = 'Must specify non-empty string origin.';
        }
        else if (!type || typeof type !== 'string') {
            errorMessage = 'Must specify non-empty string type.';
        }
        else if (requestData && (typeof requestData !== 'object' || Array.isArray(requestData))) {
            errorMessage = 'Request data must be a plain object if specified.';
        }
        if (errorMessage) {
            throw eth_rpc_errors_1.ethErrors.rpc.internal(errorMessage);
        }
    }
    _addPendingApprovalOrigin(origin, type) {
        const originSet = this._origins.get(origin) || new Set();
        originSet.add(type);
        if (!this._origins.has(origin)) {
            this._origins.set(origin, originSet);
        }
    }
    _addToStore(id, origin, type, requestData) {
        const approval = {
            id,
            origin,
            type,
            time: Date.now(),
            requestData: requestData || null,
        };
        const { pendingApprovals } = this.getState();
        const addData = {};
        addData[id] = approval;
        this.updateState({
            pendingApprovals: Object.assign(Object.assign({}, pendingApprovals), addData),
            pendingApprovalCount: Object.keys(pendingApprovals).length + 1,
        });
    }
    _add(origin, type, requestData, id = (0, uuid_1.v1)()) {
        var _a;
        this._validateAddParams(id, origin, type, requestData);
        if ((_a = this._origins.get(origin)) === null || _a === void 0 ? void 0 : _a.has(type)) {
            throw eth_rpc_errors_1.ethErrors.rpc.resourceUnavailable(getAlreadyPendingMessage(origin, type));
        }
        // add pending approval
        return new Promise((resolve, reject) => {
            this._approvals.set(id, { resolve, reject });
            this._addPendingApprovalOrigin(origin, type);
            this._addToStore(id, origin, type, requestData);
        });
    }
    _delete(id) {
        this._approvals.delete(id);
        const { origin, type } = this.getState().pendingApprovals[id];
        this._origins.get(origin).delete(type);
        if (this._isEmptyOrigin(origin)) {
            this._origins.delete(origin);
        }
        const { pendingApprovals } = this.getState();
        if (!pendingApprovals[id]) {
            return;
        }
        const _pendingApprovals = Object.assign({}, pendingApprovals);
        delete _pendingApprovals[id];
        this.updateState({
            pendingApprovals: Object.assign({}, _pendingApprovals),
            pendingApprovalCount: Object.keys(_pendingApprovals).length,
        });
    }
    _deleteApprovalAndGetCallbacks(id) {
        const callbacks = this._approvals.get(id);
        if (!callbacks) {
            throw new Error(`Approval request with id '${id}' not found.`);
        }
        this._delete(id);
        return callbacks;
    }
    add(opts) {
        return this._add(opts.origin, opts.type, opts.requestData, opts.id);
    }
    get(id) {
        return this.getState().pendingApprovals[id];
    }
    accept(id, value) {
        this._deleteApprovalAndGetCallbacks(id).resolve(value);
    }
    reject(id, error) {
        this._deleteApprovalAndGetCallbacks(id).reject(error);
    }
    clear(rejectionError) {
        for (const id of this._approvals.keys()) {
            this.reject(id, rejectionError);
        }
        this._origins.clear();
        this.updateState(getDefaultState());
    }
    /**
     * the number of 'unapproved' Messages in this.messages.
     */
    getUnapprovedMessagesCount() {
        return Object.keys(this.getUnapprovedMessages()).length;
    }
    getUnapprovedTypeMessagesCount() {
        return Object.keys(this.getUnapprovedTypeMessages()).length;
    }
    /**
     * the 'unapproved' Messages in state messages.
     */
    getUnapprovedMessages() {
        return this.messages
            .filter((message) => message.status === 'unapproved')
            .reduce((result, message) => {
            result[message.id] = message;
            return result;
        }, {});
    }
    /**
     * the 'unapproved' Messages in state messages.
     */
    getUnapprovedTypeMessages() {
        return this.messages
            .filter((message) => message.status === 'unapproved')
            .reduce((result, message) => {
            result[message.id] = message;
            return result;
        }, {});
    }
    addMessage(message) {
        this.messages.push(message);
        this.saveMessageList();
    }
    addTypeMessage(message) {
        this.typeMessages.push(message);
        this.saveTypeMessageList();
    }
    /**
     * Saves the unapproved messages and count to state.
     *
     */
    saveMessageList() {
        const unapprovedMessages = this.getUnapprovedMessages();
        const unapprovedMessagesCount = this.getUnapprovedMessagesCount();
        this.updateState({ unapprovedMessages, unapprovedMessagesCount });
        this.hub.emit('updateBadge');
    }
    saveTypeMessageList() {
        const unapprovedTypeMessages = this.getUnapprovedTypeMessages();
        const unapprovedTypeMessagesCount = this.getUnapprovedTypeMessagesCount();
        this.updateState({ unapprovedTypeMessages, unapprovedTypeMessagesCount });
        this.hub.emit('updateBadge');
    }
    getMessage(messageId) {
        return this.messages.find((message) => message.id === messageId);
    }
    getTypeMessage(messageId) {
        return this.typeMessages.find((message) => message.id === messageId);
    }
    updateMessage(message) {
        const index = this.messages.findIndex((msg) => message.id === msg.id);
        /* istanbul ignore next */
        if (index !== -1) {
            this.messages[index] = message;
        }
        this.saveMessageList();
    }
    updateTypeMessage(message) {
        const index = this.typeMessages.findIndex((msg) => message.id === msg.id);
        /* istanbul ignore next */
        if (index !== -1) {
            this.typeMessages[index] = message;
        }
        this.saveTypeMessageList();
    }
    setMessageStatus(messageId, status) {
        const message = this.getMessage(messageId);
        if (!message) {
            throw new Error(`${this.name}: Message not found for id: ${messageId}.`);
        }
        const _message = Object.assign({}, message);
        _message.status = status;
        this.updateMessage(_message);
        this.hub.emit(`${messageId}:${status}`, _message);
        if (status === 'rejected' || status === 'signed' || status === 'errored') {
            this.hub.emit(`${messageId}:finished`, _message);
        }
    }
    setTypeMessageStatus(messageId, status) {
        const message = this.getTypeMessage(messageId);
        if (!message) {
            throw new Error(`${this.name}: Message not found for id: ${messageId}.`);
        }
        const _message = Object.assign({}, message);
        _message.status = status;
        this.updateTypeMessage(_message);
        this.hub.emit(`${messageId}:${status}`, _message);
        if (status === 'rejected' || status === 'signed' || status === 'errored') {
            this.hub.emit(`${messageId}:finished`, _message);
        }
    }
    addUnapprovedMessageAsync(messageParams, req) {
        return new Promise((resolve, reject) => {
            (0, ApprovalUtil_1.validateSignMessageData)(messageParams);
            const messageId = this.addUnapprovedMessage(messageParams, req);
            this.hub.once(`${messageId}:finished`, (data) => {
                switch (data.status) {
                    case 'signed':
                        return resolve(data.rawSig);
                    case 'rejected':
                        return reject(new Error('Personal Message Signature: User denied message signature.'));
                    default:
                        return reject(new Error(`Personal Message Signature: Unknown problem: ${JSON.stringify(messageParams)}`));
                }
            });
        });
    }
    addUnapprovedMessage(messageParams, req) {
        if (req) {
            messageParams.origin = req.origin;
        }
        messageParams.data = (0, ApprovalUtil_1.normalizeMessageData)(messageParams.data);
        const messageId = (0, uuid_1.v1)();
        const messageData = {
            id: messageId,
            messageParams,
            status: 'unapproved',
            time: Date.now(),
            type: 'personal_sign',
            rawSig: '',
        };
        this.addMessage(messageData);
        this.hub.emit(`unapprovedMessage`, Object.assign(Object.assign({}, messageParams), { messageId }));
        return messageId;
    }
    addUnapprovedTypeMessageAsync(messageParams, req) {
        return new Promise((resolve, reject) => {
            const messageId = this.addUnapprovedTypeMessage(messageParams, req);
            this.hub.once(`${messageId}:finished`, (data) => {
                switch (data.status) {
                    case 'signed':
                        return resolve(data.rawSig);
                    case 'rejected':
                        return reject(new Error('Personal Message Signature: User denied message signature.'));
                    default:
                        return reject(new Error(`Personal Message Signature: Unknown problem: ${JSON.stringify(messageParams)}`));
                }
            });
        });
    }
    addUnapprovedTypeMessage(messageParams, req) {
        if (req) {
            messageParams.origin = req.origin;
        }
        const messageId = (0, uuid_1.v1)();
        const messageData = {
            id: messageId,
            messageParams,
            status: 'unapproved',
            time: Date.now(),
            type: 'eth_signTypedData_v3',
            rawSig: '',
        };
        this.addTypeMessage(messageData);
        this.hub.emit(`unapprovedMessage`, Object.assign(Object.assign({}, messageParams), { messageId }));
        return messageId;
    }
    setMessageStatusSigned(messageId, rawSig) {
        const message = this.getMessage(messageId);
        /* istanbul ignore if */
        if (!message) {
            return;
        }
        message.rawSig = rawSig;
        this.updateMessage(message);
        this.setMessageStatus(messageId, 'signed');
    }
    prepMessageForSigning(messageParams) {
        delete messageParams.messageId;
        return Promise.resolve(messageParams);
    }
    setMessageStatusApproved(messageId) {
        this.setMessageStatus(messageId, 'approved');
    }
    approveMessage(messageParams) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.setMessageStatusApproved(messageParams.messageId);
        return this.prepMessageForSigning(messageParams);
    }
    rejectMessage(messageId) {
        this.setMessageStatus(messageId, 'rejected');
    }
    setTypeMessageStatusSigned(messageId, rawSig) {
        const message = this.getTypeMessage(messageId);
        /* istanbul ignore if */
        if (!message) {
            return;
        }
        message.rawSig = rawSig;
        this.updateTypeMessage(message);
        this.setTypeMessageStatus(messageId, 'signed');
    }
    prepTypeMessageForSigning(messageParams) {
        delete messageParams.messageId;
        return Promise.resolve(messageParams);
    }
    setTypeMessageStatusApproved(messageId) {
        this.setTypeMessageStatus(messageId, 'approved');
    }
    approveTypeMessage(messageParams) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.setTypeMessageStatusApproved(messageParams.messageId);
        return this.prepTypeMessageForSigning(messageParams);
    }
    rejectTypeMessage(messageId) {
        this.setTypeMessageStatus(messageId, 'rejected');
    }
}
exports.ApprovalService = ApprovalService;
exports.default = ApprovalService;
//# sourceMappingURL=ApprovalService.js.map