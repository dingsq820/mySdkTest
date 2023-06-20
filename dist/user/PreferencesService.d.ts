import { AbstractAdapter, IConfig, IState } from '../core/AbstractAdapter';
import { AbstractService } from '../core/AbstractService';
/**
 * Custom RPC network preferences
 *
 * @param blockExplorerUrl - Block explorer URL.
 */
export interface RpcPreferences {
    blockExplorerUrl: string;
}
/**
 * @type ContactEntry
 *
 * ContactEntry representation
 * @property address - Hex address of a recipient account
 * @property name - Nickname associated with this address
 * @property importTime - Data time when an account as created/imported
 */
export interface ContactEntry {
    address: string;
    name: string;
    importTime?: number;
}
/**
 * Custom RPC network information
 *
 * @property rpcUrl - RPC target URL.
 * @property chainId - Network ID as per EIP-155
 * @property nickname - Personalized network name.
 * @property ticker - Currency ticker.
 * @property rpcPrefs - Personalized preferences.
 */
export interface FrequentRpc {
    rpcUrl: string;
    chainId?: number;
    nickname?: string;
    ticker?: string;
    rpcPrefs?: RpcPreferences;
}
/**
 * @type PreferencesState
 *
 * Preferences controller state
 * @property featureFlags - Map of specific features to enable or disable
 * @property frequentRpcList - A list of custom RPCs to provide the user
 * @property identities - Map of addresses to ContactEntry objects
 * @property lostIdentities - Map of lost addresses to ContactEntry objects
 * @property selectedAddress - Current coinbase account
 */
export interface PreferencesState extends IState {
    featureFlags: {
        [feature: string]: boolean;
    };
    frequentRpcList: FrequentRpc[];
    ipfsGateway: string;
    identities: {
        [address: string]: ContactEntry;
    };
    lostIdentities: {
        [address: string]: ContactEntry;
    };
    selectedAddress: string;
    useTokenDetection: boolean;
    useCollectibleDetection: boolean;
    openSeaEnabled: boolean;
}
export declare class PreferencesService<A extends AbstractAdapter<PreferencesState, IConfig>> extends AbstractService<A, PreferencesState, IConfig> {
    name: string;
    defaultState: {
        featureFlags: {};
        frequentRpcList: never[];
        identities: {};
        ipfsGateway: string;
        lostIdentities: {};
        selectedAddress: string;
        useTokenDetection: boolean;
        useCollectibleDetection: boolean;
        openSeaEnabled: boolean;
    };
    initialize(config: Partial<IConfig> | undefined, state: Partial<PreferencesState>): void;
    /**
     * Adds identities to state.
     *
     * @param addresses - List of addresses to use to generate new identities.
     */
    addIdentities(addresses: string[]): void;
    /**
     * Removes an identity from state.
     *
     * @param address - Address of the identity to remove.
     */
    removeIdentity(address: string): void;
    /**
     * Associates a new label with an identity.
     *
     * @param address - Address of the identity to associate.
     * @param label - New label to assign.
     */
    setAccountLabel(address: string, label: string): void;
    /**
     * Enable or disable a specific feature flag.
     *
     * @param feature - Feature to toggle.
     * @param activated - Value to assign.
     */
    setFeatureFlag(feature: string, activated: boolean): void;
    /**
     * Synchronizes the current identity list with new identities.
     *
     * @param addresses - List of addresses corresponding to identities to sync.
     * @returns Newly-selected address after syncing.
     */
    syncIdentities(addresses: string[]): string;
    /**
     * Generates and stores a new list of stored identities based on address. If the selected address
     * is unset, or if it refers to an identity that was removed, it will be set to the first
     * identity.
     *
     * @param addresses - List of addresses to use as a basis for each identity.
     */
    updateIdentities(addresses: string[]): void;
    /**
     * Adds custom RPC URL to state.
     *
     * @param url - The custom RPC URL.
     * @param chainId - The chain ID of the network, as per EIP-155.
     * @param ticker - Currency ticker.
     * @param nickname - Personalized network name.
     * @param rpcPrefs - Personalized preferences.
     */
    addToFrequentRpcList(url: string, chainId?: number, ticker?: string, nickname?: string, rpcPrefs?: RpcPreferences): void;
    /**
     * Removes custom RPC URL from state.
     *
     * @param url - Custom RPC URL.
     */
    removeFromFrequentRpcList(url: string): void;
    /**
     * Sets selected address.
     *
     * @param selectedAddress - Ethereum address.
     */
    setSelectedAddress(selectedAddress: string): void;
    /**
     * Sets new IPFS gateway.
     *
     * @param ipfsGateway - IPFS gateway string.
     */
    setIpfsGateway(ipfsGateway: string): void;
    /**
     * Toggle the token detection setting.
     *
     * @param useTokenDetection - Boolean indicating user preference on token detection.
     */
    setUseTokenDetection(useTokenDetection: boolean): void;
    /**
     * Toggle the collectible detection setting.
     *
     * @param useCollectibleDetection - Boolean indicating user preference on collectible detection.
     */
    setUseCollectibleDetection(useCollectibleDetection: boolean): void;
    /**
     * Toggle the opensea enabled setting.
     *
     * @param openSeaEnabled - Boolean indicating user preference on using OpenSea's API.
     */
    setOpenSeaEnabled(openSeaEnabled: boolean): void;
    /**
     * Convert an address to a checksummed hexidecimal address.
     *
     * @param address - The address to convert.
     * @returns A 0x-prefixed hexidecimal checksummed address.
     */
    toChecksumHexAddress(address: string): string;
    /**
     * get current account address
     *
     * @return selected address
     */
    getSelectedAddress(): string;
}
export default PreferencesService;
