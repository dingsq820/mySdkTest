/// <reference types="node" />
import { EventEmitter } from 'events';
declare class WebviewPort extends EventEmitter {
    private _window;
    private _isMainFrame;
    constructor(window: any, isMainFrame: boolean);
    postMessage: (msg: any, origin?: string) => void;
}
declare class WalletConnectPort extends EventEmitter {
    private _wcRequestActions;
    private serviceManager;
    constructor(wcRequestActions: any, serviceManager: any);
    postMessage: (msg: any) => void;
}
export { WebviewPort, WalletConnectPort };
