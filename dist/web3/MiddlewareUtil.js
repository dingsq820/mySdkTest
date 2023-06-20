"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLoggerMiddleware = exports.createOriginMiddleware = exports.NOTIFICATION_NAMES = void 0;
/**
 * List of rpc errors caused by the user rejecting a certain action.
 */
const USER_REJECTED_ERRORS = ['user rejected', 'user denied', 'user cancelled'];
const USER_REJECTED_ERROR_CODE = 4001;
exports.NOTIFICATION_NAMES = {
    accountsChanged: 'digitalwallet_accountsChanged',
    unlockStateChanged: 'digitalwallet_unlockStateChanged',
    chainChanged: 'digitalwallet_chainChanged',
};
/**
 * Returns a middleware that appends the DApp origin to request
 * @param {{ origin: string }} opts - The middleware options
 * @returns {Function}
 */
function createOriginMiddleware(opts) {
    return function originMiddleware(
    /** @type {any} */ req, 
    /** @type {any} */ _, 
    /** @type {Function} */ next) {
        req.origin = opts.origin;
        // web3-provider-engine compatibility
        // TODO:provider delete this after web3-provider-engine deprecation
        if (!req.params) {
            req.params = [];
        }
        next();
    };
}
exports.createOriginMiddleware = createOriginMiddleware;
/**
 * Checks if the error code or message contains a user rejected error
 * @param {String} errorMessage
 * @returns {boolean}
 */
function containsUserRejectedError(errorMessage, errorCode) {
    try {
        if (!errorMessage || !(typeof errorMessage === 'string'))
            return false;
        const userRejectedErrorMessage = USER_REJECTED_ERRORS.some((userRejectedError) => errorMessage.toLowerCase().includes(userRejectedError.toLowerCase()));
        if (userRejectedErrorMessage)
            return true;
        if (errorCode === USER_REJECTED_ERROR_CODE)
            return true;
        return false;
    }
    catch (e) {
        return false;
    }
}
/**
 * Returns a middleware that logs RPC activity
 * @returns {Function}
 */
function createLoggerMiddleware() {
    return function loggerMiddleware(
    /** @type {any} */ req, 
    /** @type {any} */ res, 
    /** @type {Function} */ next) {
        next((/** @type {Function} */ cb) => {
            if (res.error) {
                const { error } = res, resWithoutError = __rest(res, ["error"]);
                if (error) {
                    if (!containsUserRejectedError(error.message, error.code)) {
                        /**
                         * Example of a rpc error:
                         * { "code":-32603,
                         *   "message":"Internal JSON-RPC error.",
                         *   "data":{"code":-32000,"message":"******"}
                         * }
                         */
                        let errorToLog = error;
                        const errorParams = {
                            message: 'Error in RPC response',
                            orginalError: error,
                            res: resWithoutError,
                        };
                        if (error.message) {
                            errorToLog = new Error(error.message);
                        }
                        if (error.data) {
                            // @ts-expect-error TS(2339): Property 'data' does not exist on type '{ message:... Remove this comment to see the full error message
                            errorParams.data = error.data;
                            if (error.data.message) {
                                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                errorToLog = new Error(error.data.message);
                            }
                        }
                    }
                }
            }
            if (req.isDigitalWalletInternal) {
                return;
            }
            cb();
        });
    };
}
exports.createLoggerMiddleware = createLoggerMiddleware;
//# sourceMappingURL=MiddlewareUtil.js.map