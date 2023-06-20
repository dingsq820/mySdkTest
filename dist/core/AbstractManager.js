"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractManager = void 0;
/**
 *
 */
class AbstractManager {
    constructor() {
        this._registers = {};
        this._subscribers = new Map();
    }
    /**
     * Enables the controller. This sets each config option as a member
     * variable on this instance and triggers any defined setters. This
     * also sets initial state and triggers any listeners.
     *
     * @returns This service instance.
     */
    bind(service, adapter) {
        service.adapter = adapter;
        service.manager = this;
        this._registers[service.name] = service;
        service.initialize(adapter.configure(), adapter.defaultState);
        return service;
    }
    /**
     * Get the service object by the service name
     * @param name Service name.
     */
    getServiceByName(name) {
        return this._registers[name];
    }
    /**
     * Get the adapter object by the service name
     * @param name Service name.
     */
    getAdapterByServiceName(name) {
        const service = this._registers[name];
        if (service) {
            return service.adapter;
        }
        return null;
    }
    /**
     *
     */
    get subscribers() {
        return this._subscribers;
    }
    /**
     * Adds new subscriber to be notified of data changes.
     *
     * @param topic - The callback triggered when data changes.
     * @param subscriber - The callback triggered when data changes.
     */
    subscribe(topic, subscriber) {
        const list = this._subscribers.get(topic) || [];
        list.push(subscriber);
        this._subscribers.set(topic, list);
    }
    /**
     * Removes existing subscriber from receiving state changes.
     *
     * @param topic - The name to subscriber.
     * @param subscriber - The callback to remove.
     */
    unsubscribe(topic, subscriber) {
        const list = this._subscribers.get(topic) || [];
        if (subscriber) {
            const index = list.findIndex((cb) => subscriber === cb);
            index > -1 && list.splice(index, 1);
            this._subscribers.set(topic, list);
        }
        else {
            this._subscribers.set(topic, []);
        }
    }
}
exports.AbstractManager = AbstractManager;
//# sourceMappingURL=AbstractManager.js.map