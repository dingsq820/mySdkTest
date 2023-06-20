import { AbstractAdapter, IConfig, IState } from '../core/AbstractAdapter';
import { AbstractService } from '../core/AbstractService';
export declare const POLYGON = "polygon";
/**
 * @type Fetch All Options
 * @property fromBlock - String containing a specific block decimal number
 * @property etherscanApiKey - API key to be used to fetch token transactions
 */
export interface FetchNftAllOptions {
    fromBlockNum?: string;
    apiKey?: string;
}
/**
 * @type Transaction
 *
 * Transaction representation
 * @property from - Address to send this transaction from
 * @property to - Address to send this transaction to
 * @property status - String status of this transaction
 * @property time - Timestamp associated with this transaction
 * @property transaction - Underlying Transaction object
 * @property transactionHash - Hash of a successful transaction
 * @property blockNumber - Number of the block where the transaction has been included
 */
export interface TransactionData {
    chainId?: string;
    from: string;
    to?: string;
    status: 'confirmed';
    time: number;
    transactionHash?: string;
    blockNumber?: string;
}
/**
 * @type PolygonScanTransaction
 *
 * PolygonScanTransaction representation
 * @property blockNumber - Number of the block where the transaction has been included
 * @property timeStamp - Timestamp associated with this transaction
 * @property hash - Hash of a successful transaction
 * @property nonce - Nonce of the transaction
 * @property blockHash - Hash of the block where the transaction has been included
 * @property transactionIndex - Etherscan internal index for this transaction
 * @property from - Address to send this transaction from
 * @property to - Address to send this transaction to
 * @property gas - Gas to send with this transaction
 * @property gasPrice - Price of gas with this transaction
 * @property isError - Synthesized error information for failed transactions
 * @property txreceipt_status - Receipt status for this transaction
 * @property input - input of the transaction
 * @property contractAddress - Address of the contract
 * @property cumulativeGasUsed - Amount of gas used
 * @property confirmations - Number of confirmations
 * @property tokenID - ID of token
 * @property tokenName - Name of token
 */
export interface PolygonScanTransaction {
    blockNumber: string;
    timeStamp: string;
    hash: string;
    nonce: string;
    blockHash: string;
    transactionIndex: string;
    from: string;
    to: string;
    value: string;
    gas: string;
    gasPrice: string;
    cumulativeGasUsed: string;
    gasUsed: string;
    isError: string;
    txreceipt_status: string;
    input: string;
    contractAddress: string;
    confirmations: string;
    tokenDecimal: string;
    tokenSymbol: string;
    tokenID: string;
    tokenName: string;
}
/**
 * @type TransactionConfig
 *
 * Transaction controller configuration
 * @property netWorkType - Polling interval used to fetch new currency rate
 * @property provider - Provider used to create a new underlying EthQuery instance
 * @property sign - Method used to sign transactions
 */
export interface TransactionConfig extends IConfig {
    chainId: string;
    netWorkType: string;
}
/**
 * @type TransactionState
 *
 * Transaction service state
 * @property transactions - A list of Transaction objects
 */
export interface TransactionState extends IState {
    transactions: TransactionData[];
}
/**
 * Service responsible for submitting and managing transactions
 */
export declare class TransactionService<A extends AbstractAdapter<TransactionState, TransactionConfig>> extends AbstractService<A, TransactionState, TransactionConfig> {
    /**
     * Name of this service used during composition
     */
    name: string;
    initialize(): void;
    /**
     * Get transactions from Etherscan Or Polygon for the given address. By default all transactions are
     * returned, but the `fromBlock` option can be given to filter just for transactions from a
     * specific block onward.
     *
     * @param address - The address to fetch the transactions for.
     * @param opt - Object containing optional data, fromBlock and Etherscan Or Polygon API key.
     * @returns The block number of the latest incoming transaction.
     */
    fetchNftAll(address: string, opt?: FetchNftAllOptions): Promise<string | void>;
}
export default TransactionService;
