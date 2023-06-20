import { AbstractAdapter, IConfig, IState } from '../core/AbstractAdapter';
import { AbstractService } from '../core/AbstractService';
import DidModel from './DidModel';
export interface DidConfig extends IConfig {
    selectCreator: string;
    urlOperation: string;
    urlResolve: string;
}
export interface DidState extends IState {
    didModel?: DidModel | null;
    did?: string | null;
}
export declare class DidService<A extends AbstractAdapter<DidState, DidConfig>> extends AbstractService<A, DidState, DidConfig> {
    name: string;
    private didManager;
    static RESERVE_ID: {
        RECOVERY: string;
        UPDATE: string;
    };
    initialize(config: Partial<DidConfig> | undefined): void;
    createDid(primaryKey: string): Promise<DidModel | undefined>;
    resolveDid(did: string): Promise<string>;
    clearDid(): void;
    /**
     * did
     * @param did
     */
    setDid(did: string): void;
}
export default DidService;
