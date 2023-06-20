import { AbstractAdapter, IConfig, IState } from '../core/AbstractAdapter';
export declare abstract class AbstractAccountAdapter<S extends IState, C extends IConfig> extends AbstractAdapter<S, C> {
    constructor(state?: Partial<S>);
    /**
     * get app device type
     */
    abstract deviceType(): string;
    abstract supportedBiometryType(): any;
    abstract resetGenericPassword(): Promise<boolean>;
    abstract setGenericPassword(password: string, type: string): Promise<boolean>;
}
export default AbstractAccountAdapter;
