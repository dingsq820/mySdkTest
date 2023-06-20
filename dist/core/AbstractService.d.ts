import type { AbstractAdapter, IConfig, IState } from './AbstractAdapter';
import type { AbstractManager } from './AbstractManager';
export declare abstract class AbstractService<A extends AbstractAdapter<S, C>, S extends IState, C extends IConfig> {
    /**
     * Name of this service used during composition
     */
    name: string;
    private _adapter;
    private _manager;
    defaultState: S;
    private _state;
    abstract initialize(config?: Partial<C>, state?: Partial<S> | undefined): void;
    get manager(): AbstractManager | undefined;
    set manager(value: AbstractManager | undefined);
    /**
     *
     * @param adp
     */
    set adapter(adp: A | undefined);
    get adapter(): A | undefined;
    /**
     * Retrieves current controller state.
     * @returns The current state.
     */
    getState(): S;
    /**
     * Updates adapter state.
     * @param state - The new state.
     */
    updateState(state?: Partial<S>): void;
    /**
     *
     * @param topic
     * @param payload
     */
    publish(topic: string, payload: any): void;
}
export default AbstractService;
