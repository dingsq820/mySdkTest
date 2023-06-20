"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupMultiplex = exports.jsonStringifyStream = exports.jsonParseStream = exports.ConnectionStream = void 0;
/* eslint-disable func-names */
const buffer_1 = require("buffer");
const obj_multiplex_1 = __importDefault(require("obj-multiplex"));
const pump_1 = __importDefault(require("pump"));
const readable_stream_1 = require("readable-stream");
const through2_1 = __importDefault(require("through2"));
// eslint-disable-next-line no-empty-function
const noop = () => { };
class ConnectionStream extends readable_stream_1.Duplex {
    constructor(port, url) {
        super({
            objectMode: true,
        });
        /**
         * Explicitly sets read operations to a no-op
         */
        this._read = noop;
        this._port = port;
        this._url = url;
        this._port.addListener('message', this._onMessage.bind(this));
        this._port.addListener('disconnect', this._onDisconnect.bind(this));
    }
    /**
     * Callback triggered when a message is received from
     * the remote Port associated with this Stream.
     *
     * @private
     * @param {Object} msg - Payload from the onMessage listener of Port
     */
    _onMessage(msg) {
        if (buffer_1.Buffer.isBuffer(msg)) {
            // @ts-expect-error TS(2339): Property '_isBuffer' does not exist on type 'Buffe... Remove this comment to see the full error message
            delete msg._isBuffer;
            const data = new buffer_1.Buffer(msg);
            this.push(data);
        }
        else {
            this.push(msg);
        }
    }
    /**
     * Callback triggered when the remote Port
     * associated with this Stream disconnects.
     *
     * @private
     */
    _onDisconnect() {
        this.destroy && this.destroy();
    }
    /**
     * Called internally when data should be written to
     * this writable stream.
     *
     * @private
     * @param {*} msg Arbitrary object to write
     * @param {string} encoding Encoding to use when writing payload
     * @param {Function} cb Called when writing is complete or an error occurs
     */
    _write(msg, encoding, cb) {
        try {
            if (buffer_1.Buffer.isBuffer(msg)) {
                const data = msg.toJSON();
                // @ts-expect-error TS(2339): Property '_isBuffer' does not exist on type '{ typ... Remove this comment to see the full error message
                data._isBuffer = true;
                this._port.postMessage(data, this._url);
            }
            else {
                this._port.postMessage(msg, this._url);
            }
        }
        catch (err) {
            return cb(new Error('ConnectionStream - disconnected'));
        }
        return cb();
    }
}
exports.default = ConnectionStream;
exports.ConnectionStream = ConnectionStream;
/**
 * Returns a stream transform that parses JSON strings passing through
 * @return {stream.Transform}
 */
function jsonParseStream() {
    return through2_1.default.obj(function (serialized, _, cb) {
        this.push(JSON.parse(serialized));
        cb();
    });
}
exports.jsonParseStream = jsonParseStream;
/**
 * Returns a stream transform that calls {@code JSON.stringify}
 * on objects passing through
 * @return {stream.Transform} the stream transform
 */
function jsonStringifyStream() {
    return through2_1.default.obj(function (obj, _, cb) {
        this.push(JSON.stringify(obj));
        cb();
    });
}
exports.jsonStringifyStream = jsonStringifyStream;
/**
 * Sets up stream multiplexing for the given stream
 * @param {any} connectionStream - the stream to mux
 * @return {stream.Stream} the multiplexed stream
 */
function setupMultiplex(connectionStream) {
    const mux = new obj_multiplex_1.default();
    (0, pump_1.default)(connectionStream, mux, connectionStream, (err) => {
        if (err) {
            console.warn(err);
        }
    });
    return mux;
}
exports.setupMultiplex = setupMultiplex;
//# sourceMappingURL=ConnectionStream.js.map