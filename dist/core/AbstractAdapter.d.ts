/**
 * @type IConfig
 *
 * Base Adapter configuration
 * @property disabled - Determines if this adapter is enabled
 */
export interface IConfig {
    disabled?: boolean;
}
/**
 * @type IState
 *
 * Base state representation
 * @property name - Unique name for this adapter
 */
export interface IState {
    name?: string;
}
/**
 * State change callbacks
 */
export declare type Listener<T> = (state: T, name: string) => void;
export declare abstract class AbstractAdapter<S extends IState, C extends IConfig> {
    private _listeners;
    /**
     * Default state set on this adapter
     * @private
     */
    private readonly _defaultState;
    constructor(state?: Partial<S>);
    /**
     * Initialization function
     *
     */
    abstract initialize(): void;
    /**
     * The configuration provided by adapter to the service
     */
    abstract configure(): Partial<C>;
    /**
     * Updates adapter state.
     * @param serviceState - The new state.
     * @param serviceName - serviceName.
     */
    abstract onStateUpdate(serviceState: Partial<S>, serviceName: string): void;
    /**
     *  get default config set on this adapter
     */
    get defaultState(): S;
    /**
     *
     */
    get listeners(): Listener<S>[];
    /**
     * Adds new listener to be notified of state changes.
     * @param listener - The callback triggered when state changes.
     */
    addStateListener(listener: Listener<S>): void;
    /**
     * Removes existing listener from receiving state changes.
     *
     * @param listener - The callback to remove.
     * @returns `true` if a listener is found and removed.
     */
    removeStateListener(listener: Listener<S>): boolean;
}
