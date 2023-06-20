"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractAdapter = void 0;
class AbstractAdapter {
    constructor(state = {}) {
        this._listeners = [];
        /**
         * Default state set on this adapter
         * @private
         */
        this._defaultState = {};
        this._defaultState = state;
        this.initialize();
    }
    /**
     *  get default config set on this adapter
     */
    get defaultState() {
        return this._defaultState;
    }
    /**
     *
     */
    get listeners() {
        return this._listeners;
    }
    /**
     * Adds new listener to be notified of state changes.
     * @param listener - The callback triggered when state changes.
     */
    addStateListener(listener) {
        this._listeners.push(listener);
    }
    /**
     * Removes existing listener from receiving state changes.
     *
     * @param listener - The callback to remove.
     * @returns `true` if a listener is found and removed.
     */
    removeStateListener(listener) {
        const index = this._listeners.findIndex((cb) => listener === cb);
        index > -1 && this._listeners.splice(index, 1);
        return index > -1;
    }
}
exports.AbstractAdapter = AbstractAdapter;
//# sourceMappingURL=AbstractAdapter.js.map