"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JS_IFRAME_POST_MESSAGE_TO_PROVIDER = exports.JS_POST_MESSAGE_TO_PROVIDER = void 0;
const JS_POST_MESSAGE_TO_PROVIDER = (message, origin) => `(function () {
  try {
    window.postMessage(${JSON.stringify(message)}, '${origin}');
  } catch (e) {
    //Nothing to do
  }
})()`;
exports.JS_POST_MESSAGE_TO_PROVIDER = JS_POST_MESSAGE_TO_PROVIDER;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JS_IFRAME_POST_MESSAGE_TO_PROVIDER = (message, origin) => `(function () {})()`;
exports.JS_IFRAME_POST_MESSAGE_TO_PROVIDER = JS_IFRAME_POST_MESSAGE_TO_PROVIDER;
//# sourceMappingURL=WebviewScripts.js.map