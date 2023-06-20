export declare const NOTIFICATION_NAMES: {
    accountsChanged: string;
    unlockStateChanged: string;
    chainChanged: string;
};
/**
 * Returns a middleware that appends the DApp origin to request
 * @param {{ origin: string }} opts - The middleware options
 * @returns {Function}
 */
export declare function createOriginMiddleware(opts: any): (req: any, _: any, next: any) => void;
/**
 * Returns a middleware that logs RPC activity
 * @returns {Function}
 */
export declare function createLoggerMiddleware(): (req: any, res: any, next: any) => void;
