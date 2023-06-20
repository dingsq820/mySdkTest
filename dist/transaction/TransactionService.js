"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = exports.POLYGON = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const AbstractService_1 = require("../core/AbstractService");
exports.POLYGON = 'polygon';
/**
 * Make TransactionData type data
 * @param data From Polygon get data
 * @param chainId Network type of desired network
 * @returns TransactionData type data
 */
const normalizeNftTx = (data, chainId) => {
    const { timeStamp, blockNumber, to, from, hash } = data;
    const time = parseInt(timeStamp, 10) * 1000;
    return {
        chainId,
        status: 'confirmed',
        time,
        from,
        to,
        transactionHash: hash,
        blockNumber,
    };
};
/**
 * Return a URL that can be used to fetch ETH transactions.
 *
 * @param networkType - Network type of desired network.
 * @param urlParams - The parameters used to construct the URL.
 * @returns URL to fetch the access the endpoint.
 */
const getPolygonscanApiUrl = (networkType, urlParams) => {
    let polygonscanSubdomain = 'api';
    if (networkType !== exports.POLYGON) {
        polygonscanSubdomain = `api-testnet`;
    }
    const apiUrl = `https://${polygonscanSubdomain}.polygonscan.com`;
    let url = `${apiUrl}/api?`;
    for (const paramKey in urlParams) {
        if (urlParams[paramKey]) {
            url += `${paramKey}=${urlParams[paramKey]}&`;
        }
    }
    url += 'tag=latest&page=1';
    return url;
};
/**
 * Execute fetch and return object response.
 *
 * @param request - The request information.
 * @param options - The fetch options.
 * @returns The fetch response JSON data.
 */
const nftAllFetch = (request, options) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, node_fetch_1.default)(request, options);
    if (!response.ok) {
        throw new Error(`Fetch failed with status '${response.status}' for request '${request}'`);
    }
    const object = yield response.json();
    return object;
});
/**
 * Handles the fetch of incoming transactions for polygonScan.
 *
 * @param networkType - Network type of desired network.
 * @param address - Address to get the transactions from.
 * @param txHistoryLimit - The maximum number of transactions to fetch.
 * @param opt - Object that can contain fromBlock and PolygonScan service API key.
 * @returns Responses for both ERC721 and ERC1155 token transactions.
 */
const handleNftTransactionFetchForPolygonscan = (networkType, address, opt) => __awaiter(void 0, void 0, void 0, function* () {
    const urlParams = {
        module: 'account',
        address,
        startBlock: opt === null || opt === void 0 ? void 0 : opt.fromBlockNum,
        apikey: opt === null || opt === void 0 ? void 0 : opt.apiKey,
        order: 'desc',
    };
    // 1155tx
    const polygonscanToken1155TxUrl = getPolygonscanApiUrl(networkType, Object.assign(Object.assign({}, urlParams), { action: 'token1155tx' }));
    const polygonscanToken1155TxResponsePromise = nftAllFetch(polygonscanToken1155TxUrl);
    // nfttx
    const polygonscanTokenNftUrl = getPolygonscanApiUrl(networkType, Object.assign(Object.assign({}, urlParams), { action: 'tokennfttx' }));
    const polygonscanTokenNftResponsePromise = nftAllFetch(polygonscanTokenNftUrl);
    let [polygonscanToken1155TxResponse, polygonscanTokenNftResponse] = yield Promise.all([
        polygonscanToken1155TxResponsePromise,
        polygonscanTokenNftResponsePromise,
    ]);
    if (polygonscanToken1155TxResponse.status === '0' ||
        polygonscanToken1155TxResponse.result.length <= 0) {
        polygonscanToken1155TxResponse = {
            status: polygonscanToken1155TxResponse.status,
            result: [],
        };
    }
    if (polygonscanTokenNftResponse.status === '0' ||
        polygonscanTokenNftResponse.result.length <= 0) {
        polygonscanTokenNftResponse = {
            status: polygonscanTokenNftResponse.status,
            result: [],
        };
    }
    return [polygonscanToken1155TxResponse, polygonscanTokenNftResponse];
});
/**
 * Service responsible for submitting and managing transactions
 */
class TransactionService extends AbstractService_1.AbstractService {
    constructor() {
        /**
         * Name of this service used during composition
         */
        super(...arguments);
        this.name = 'TransactionService';
    }
    initialize() { }
    /**
     * Get transactions from Etherscan Or Polygon for the given address. By default all transactions are
     * returned, but the `fromBlock` option can be given to filter just for transactions from a
     * specific block onward.
     *
     * @param address - The address to fetch the transactions for.
     * @param opt - Object containing optional data, fromBlock and Etherscan Or Polygon API key.
     * @returns The block number of the latest incoming transaction.
     */
    fetchNftAll(address, opt) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const type = (_a = this.adapter) === null || _a === void 0 ? void 0 : _a.configure().netWorkType;
            const chainId = (_b = this.adapter) === null || _b === void 0 ? void 0 : _b.configure().chainId;
            let latestIncomingTxBlockNumber = '';
            if (type && chainId) {
                // polygon
                const transactionFetchResult = yield handleNftTransactionFetchForPolygonscan(type, address, opt);
                const [scanToken1155TxResponse, scanTokenNftResponse] = transactionFetchResult;
                const normalizedToken1155Txs = scanToken1155TxResponse.result.map((data) => normalizeNftTx(data, chainId));
                const normalizedTokenNftTxs = scanTokenNftResponse.result.map((data) => normalizeNftTx(data, chainId));
                const allTransaction = [
                    ...normalizedToken1155Txs,
                    ...normalizedTokenNftTxs,
                ];
                allTransaction.sort((a, b) => (a.time < b.time ? -1 : 1));
                allTransaction.forEach((data) => __awaiter(this, void 0, void 0, function* () {
                    /* istanbul ignore next */
                    if (data.chainId === chainId &&
                        data.to &&
                        data.to.toLowerCase() === address.toLowerCase()) {
                        if (data.blockNumber &&
                            (!latestIncomingTxBlockNumber ||
                                parseInt(latestIncomingTxBlockNumber, 10) < parseInt(data.blockNumber, 10))) {
                            latestIncomingTxBlockNumber = data.blockNumber;
                        }
                    }
                }));
                this.updateState({ transactions: allTransaction });
            }
            return latestIncomingTxBlockNumber;
        });
    }
}
exports.TransactionService = TransactionService;
exports.default = TransactionService;
//# sourceMappingURL=TransactionService.js.map