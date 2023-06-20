/// <reference types="node" />
import { EventEmitter } from 'events';
import { JsonRpcEngine } from 'json-rpc-engine';
/**
 * constructor parameters of ProviderBridge
 */
export interface ProviderBridgeParameters {
    webview: any;
    url: any;
    rpcMiddleware: any;
    isMainFrame: boolean;
    isWalletConnect: boolean;
    requestActions: any;
    getApprovedHosts: any;
    serviceManager: any;
}
export declare class ProviderBridge extends EventEmitter {
    private _webviewRef;
    private url;
    private hostname;
    private rpcMiddleware;
    private isMainFrame;
    private isWalletConnect;
    private getApprovedHosts;
    private disconnected;
    private port;
    private engine;
    private chainIdSent;
    private networkVersionSent;
    private addressSent;
    private _providerProxy;
    private provider;
    private serviceManager;
    constructor({ webview, url, rpcMiddleware, isMainFrame, isWalletConnect, requestActions, getApprovedHosts, serviceManager, }: ProviderBridgeParameters);
    setProvider({ provider }: any): void;
    onUnlock(): void;
    onLock(): void;
    getProviderNetworkState({ network }: any): {
        networkVersion: any;
        chainId: any;
    };
    onStateUpdate(memState: any): void;
    isUnlocked(): any;
    getProviderState(): {
        networkVersion: any;
        chainId: any;
        isUnlocked: any;
    };
    sendStateUpdate: () => void;
    onMessage: (msg: any) => void;
    onDisconnect: () => void;
    /**
     * A method for serving our ethereum provider over a given stream.
     * @param {*} outStream - The stream to provide over.
     */
    setupProviderConnection(outStream: any): void;
    /**
     * A method for creating a provider that is safely restricted for the requesting domain.
     **/
    setupProviderEngine(): JsonRpcEngine;
    sendNotification(payload: any): void;
    /**
     * The state of the sdk
     *
     * @returns {Object} status
     */
    getState(): {
        isInitialized: boolean;
        isUnlocked: boolean;
        network: any;
        selectedAddress: any;
    };
}
export default ProviderBridge;
