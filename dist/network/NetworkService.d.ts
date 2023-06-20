import { AbstractAdapter, IConfig, IState } from '../core/AbstractAdapter';
import { AbstractService } from '../core/AbstractService';
export declare type NetworkType = 'polygon' | 'mumbai';
export declare enum NetworksChainId {
    rpc = "",
    polygon = "137",
    mumbai = "80001"
}
export interface NetworkState extends IState {
    network: string;
}
export interface NetworkConfig extends IConfig {
    type: NetworkType;
    rpcTarget: string;
    chainId: string;
    ticker?: string;
    nickname?: string;
}
export declare class NetworkService<A extends AbstractAdapter<NetworkState, NetworkConfig>> extends AbstractService<A, NetworkState, NetworkConfig> {
    name: string;
    provider: any;
    ethQuery: any;
    private mutex;
    initialize(config?: Partial<NetworkConfig>): void;
    private onNetworkError;
    updateNetwork(): Promise<void>;
}
export default NetworkService;
