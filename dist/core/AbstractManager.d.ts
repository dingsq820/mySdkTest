import { AbstractAdapter } from './AbstractAdapter';
import { AbstractService } from './AbstractService';
/**
 * @type GlobalConfig
 */
export interface GlobalConfig {
}
/**
 * State change callbacks
 */
export declare type Subscriber = (topic: string, payload: any) => void;
/**
 *
 */
export declare abstract class AbstractManager {
    private _registers;
    private _subscribers;
    /**
     *
     */
    abstract globalConfigure(): GlobalConfig;
    /**
     * Enables the controller. This sets each config option as a member
     * variable on this instance and triggers any defined setters. This
     * also sets initial state and triggers any listeners.
     *
     * @returns This service instance.
     */
    bind<T extends AbstractService<A, any, any>, A extends AbstractAdapter<any, any>>(service: T, adapter: A): T;
    /**
     * Get the service object by the service name
     * @param name Service name.
     */
    getServiceByName<T extends AbstractService<any, any, any>>(name: string): T | undefined;
    /**
     * Get the adapter object by the service name
     * @param name Service name.
     */
    getAdapterByServiceName<A extends AbstractAdapter<any, any>>(name: string): A | null | undefined;
    /**
     *
     */
    get subscribers(): Map<string, Subscriber[]>;
    /**
     * Adds new subscriber to be notified of data changes.
     *
     * @param topic - The callback triggered when data changes.
     * @param subscriber - The callback triggered when data changes.
     */
    subscribe(topic: string, subscriber: Subscriber): void;
    /**
     * Removes existing subscriber from receiving state changes.
     *
     * @param topic - The name to subscriber.
     * @param subscriber - The callback to remove.
     */
    unsubscribe(topic: string, subscriber?: Subscriber | undefined | null): void;
}
