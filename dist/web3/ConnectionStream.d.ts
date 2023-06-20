import { Duplex } from 'readable-stream';
export default class ConnectionStream extends Duplex {
    _port: any;
    _url: any;
    constructor(port: any, url: any);
    /**
     * Callback triggered when a message is received from
     * the remote Port associated with this Stream.
     *
     * @private
     * @param {Object} msg - Payload from the onMessage listener of Port
     */
    _onMessage(this: any, msg: any): void;
    /**
     * Callback triggered when the remote Port
     * associated with this Stream disconnects.
     *
     * @private
     */
    _onDisconnect(this: any): void;
    /**
     * Explicitly sets read operations to a no-op
     */
    _read: () => void;
    /**
     * Called internally when data should be written to
     * this writable stream.
     *
     * @private
     * @param {*} msg Arbitrary object to write
     * @param {string} encoding Encoding to use when writing payload
     * @param {Function} cb Called when writing is complete or an error occurs
     */
    _write(this: any, msg: any, encoding: any, cb: any): any;
}
/**
 * Returns a stream transform that parses JSON strings passing through
 * @return {stream.Transform}
 */
declare function jsonParseStream(): any;
/**
 * Returns a stream transform that calls {@code JSON.stringify}
 * on objects passing through
 * @return {stream.Transform} the stream transform
 */
declare function jsonStringifyStream(): any;
/**
 * Sets up stream multiplexing for the given stream
 * @param {any} connectionStream - the stream to mux
 * @return {stream.Stream} the multiplexed stream
 */
declare function setupMultiplex(connectionStream: any): any;
export { ConnectionStream, jsonParseStream, jsonStringifyStream, setupMultiplex };
