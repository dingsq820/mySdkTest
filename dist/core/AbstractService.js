"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractService = void 0;
class AbstractService {
    constructor() {
        /**
         * Name of this service used during composition
         */
        this.name = 'IService';
        this.defaultState = {};
        this._state = this.defaultState;
    }
    get manager() {
        return this._manager;
    }
    set manager(value) {
        this._manager = value;
    }
    /**
     *
     * @param adp
     */
    set adapter(adp) {
        this._adapter = adp;
        const adapterState = adp === null || adp === void 0 ? void 0 : adp.defaultState;
        if (adapterState) {
            this.defaultState = Object.assign(Object.assign({}, this.defaultState), adapterState);
        }
        this._state = Object.assign(Object.assign({}, this._state), this.defaultState);
    }
    get adapter() {
        return this._adapter;
    }
    /**
     * Retrieves current controller state.
     * @returns The current state.
     */
    getState() {
        return this._state;
    }
    /**
     * Updates adapter state.
     * @param state - The new state.
     */
    updateState(state = {}) {
        if (this._adapter) {
            this._state = Object.assign(Object.assign({}, this._state), state);
            this._adapter.onStateUpdate(this._state, this.name);
            this._adapter.listeners.forEach((listener) => {
                if (listener) {
                    listener(Object.assign({}, this._state), this.name);
                }
            });
        }
    }
    /**
     *
     * @param topic
     * @param payload
     */
    publish(topic, payload) {
        var _a;
        const subscribers = (_a = this._manager) === null || _a === void 0 ? void 0 : _a.subscribers;
        if (subscribers) {
            const list = subscribers.get(topic);
            if (list) {
                list.forEach((subscriber) => {
                    subscriber(topic, payload);
                });
            }
        }
    }
}
exports.AbstractService = AbstractService;
exports.default = AbstractService;
//# sourceMappingURL=AbstractService.js.map