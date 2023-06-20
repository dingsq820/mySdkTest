"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreferencesService = void 0;
const ethereumjs_util_1 = require("ethereumjs-util");
const AbstractService_1 = require("../core/AbstractService");
class PreferencesService extends AbstractService_1.AbstractService {
    constructor() {
        super(...arguments);
        this.name = 'PreferencesService';
        this.defaultState = {
            featureFlags: {},
            frequentRpcList: [],
            identities: {},
            ipfsGateway: 'https://ipfs.io/ipfs/',
            lostIdentities: {},
            selectedAddress: '',
            useTokenDetection: true,
            useCollectibleDetection: false,
            openSeaEnabled: false,
        };
    }
    initialize(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    config, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    state
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    ) { }
    /**
     * Adds identities to state.
     *
     * @param addresses - List of addresses to use to generate new identities.
     */
    addIdentities(addresses) {
        const { identities } = this.getState();
        addresses.forEach((address) => {
            address = this.toChecksumHexAddress(address);
            if (identities[address]) {
                return;
            }
            const identityCount = Object.keys(identities).length;
            identities[address] = {
                name: `Account ${identityCount + 1}`,
                address,
                importTime: Date.now(),
            };
        });
        this.updateState({ identities: Object.assign({}, identities) });
    }
    /**
     * Removes an identity from state.
     *
     * @param address - Address of the identity to remove.
     */
    removeIdentity(address) {
        address = this.toChecksumHexAddress(address);
        const { identities } = this.getState();
        if (!identities[address]) {
            return;
        }
        delete identities[address];
        this.updateState({ identities: Object.assign({}, identities) });
        if (address === this.getState().selectedAddress) {
            this.updateState({ selectedAddress: Object.keys(identities)[0] });
        }
    }
    /**
     * Associates a new label with an identity.
     *
     * @param address - Address of the identity to associate.
     * @param label - New label to assign.
     */
    setAccountLabel(address, label) {
        address = this.toChecksumHexAddress(address);
        const { identities } = this.getState();
        identities[address] = identities[address] || {};
        identities[address].name = label;
        this.updateState({ identities: Object.assign({}, identities) });
    }
    /**
     * Enable or disable a specific feature flag.
     *
     * @param feature - Feature to toggle.
     * @param activated - Value to assign.
     */
    setFeatureFlag(feature, activated) {
        const oldFeatureFlags = this.getState().featureFlags;
        const featureFlags = Object.assign(Object.assign({}, oldFeatureFlags), { [feature]: activated });
        this.updateState({ featureFlags: Object.assign({}, featureFlags) });
    }
    /**
     * Synchronizes the current identity list with new identities.
     *
     * @param addresses - List of addresses corresponding to identities to sync.
     * @returns Newly-selected address after syncing.
     */
    syncIdentities(addresses) {
        addresses = addresses.map((address) => this.toChecksumHexAddress(address));
        const { identities, lostIdentities } = this.getState();
        const newlyLost = {};
        for (const identity in identities) {
            if (addresses.indexOf(identity) === -1) {
                newlyLost[identity] = identities[identity];
                delete identities[identity];
            }
        }
        if (Object.keys(newlyLost).length > 0) {
            for (const key in newlyLost) {
                lostIdentities[key] = newlyLost[key];
            }
        }
        this.updateState({
            identities: Object.assign({}, identities),
            lostIdentities: Object.assign({}, lostIdentities),
        });
        this.addIdentities(addresses);
        if (addresses.indexOf(this.getState().selectedAddress) === -1) {
            this.updateState({ selectedAddress: addresses[0] });
        }
        return this.getState().selectedAddress;
    }
    /**
     * Generates and stores a new list of stored identities based on address. If the selected address
     * is unset, or if it refers to an identity that was removed, it will be set to the first
     * identity.
     *
     * @param addresses - List of addresses to use as a basis for each identity.
     */
    updateIdentities(addresses) {
        // addresses = addresses.map((address: string) =>
        //   this.toChecksumHexAddress(address)
        // );
        // const oldIdentities = this.getState().identities;
        const oldAddresses = [];
        const newAddresses = [];
        const oldIdentities = this.getState().identities;
        addresses.map((address) => {
            const addr = this.toChecksumHexAddress(address);
            if (oldIdentities[addr]) {
                oldAddresses.push(addr);
            }
            else {
                newAddresses.push(addr);
            }
            return addr;
        });
        addresses = oldAddresses.concat(newAddresses);
        const identities = addresses.reduce((ids, address, index) => {
            ids[address] = oldIdentities[address] || {
                address,
                name: `Account ${index + 1}`,
                importTime: Date.now(),
            };
            return ids;
        }, {});
        let { selectedAddress } = this.getState();
        if (!Object.keys(identities).includes(selectedAddress)) {
            selectedAddress = Object.keys(identities)[0];
        }
        this.updateState({ identities: Object.assign({}, identities), selectedAddress });
    }
    /**
     * Adds custom RPC URL to state.
     *
     * @param url - The custom RPC URL.
     * @param chainId - The chain ID of the network, as per EIP-155.
     * @param ticker - Currency ticker.
     * @param nickname - Personalized network name.
     * @param rpcPrefs - Personalized preferences.
     */
    addToFrequentRpcList(url, chainId, ticker, nickname, rpcPrefs) {
        const { frequentRpcList } = this.getState();
        const index = frequentRpcList.findIndex(({ rpcUrl }) => rpcUrl === url);
        if (index !== -1) {
            frequentRpcList.splice(index, 1);
        }
        const newFrequestRpc = {
            rpcUrl: url,
            chainId,
            ticker,
            nickname,
            rpcPrefs,
        };
        frequentRpcList.push(newFrequestRpc);
        this.updateState({ frequentRpcList: [...frequentRpcList] });
    }
    /**
     * Removes custom RPC URL from state.
     *
     * @param url - Custom RPC URL.
     */
    removeFromFrequentRpcList(url) {
        const { frequentRpcList } = this.getState();
        const index = frequentRpcList.findIndex(({ rpcUrl }) => rpcUrl === url);
        if (index !== -1) {
            frequentRpcList.splice(index, 1);
        }
        this.updateState({ frequentRpcList: [...frequentRpcList] });
    }
    /**
     * Sets selected address.
     *
     * @param selectedAddress - Ethereum address.
     */
    setSelectedAddress(selectedAddress) {
        this.updateState({
            selectedAddress: this.toChecksumHexAddress(selectedAddress),
        });
    }
    /**
     * Sets new IPFS gateway.
     *
     * @param ipfsGateway - IPFS gateway string.
     */
    setIpfsGateway(ipfsGateway) {
        this.updateState({ ipfsGateway });
    }
    /**
     * Toggle the token detection setting.
     *
     * @param useTokenDetection - Boolean indicating user preference on token detection.
     */
    setUseTokenDetection(useTokenDetection) {
        this.updateState({ useTokenDetection });
    }
    /**
     * Toggle the collectible detection setting.
     *
     * @param useCollectibleDetection - Boolean indicating user preference on collectible detection.
     */
    setUseCollectibleDetection(useCollectibleDetection) {
        if (useCollectibleDetection && !this.getState().openSeaEnabled) {
            throw new Error('useCollectibleDetection cannot be enabled if openSeaEnabled is false');
        }
        this.updateState({ useCollectibleDetection });
    }
    /**
     * Toggle the opensea enabled setting.
     *
     * @param openSeaEnabled - Boolean indicating user preference on using OpenSea's API.
     */
    setOpenSeaEnabled(openSeaEnabled) {
        this.updateState({ openSeaEnabled });
        if (!openSeaEnabled) {
            this.updateState({ useCollectibleDetection: false });
        }
    }
    /**
     * Convert an address to a checksummed hexidecimal address.
     *
     * @param address - The address to convert.
     * @returns A 0x-prefixed hexidecimal checksummed address.
     */
    // eslint-disable-next-line import/prefer-default-export
    toChecksumHexAddress(address) {
        const hexPrefixed = (0, ethereumjs_util_1.addHexPrefix)(address);
        if (!(0, ethereumjs_util_1.isHexString)(hexPrefixed)) {
            return hexPrefixed;
        }
        return (0, ethereumjs_util_1.toChecksumAddress)(hexPrefixed);
    }
    /**
     * get current account address
     *
     * @return selected address
     */
    getSelectedAddress() {
        return this.getState().selectedAddress;
    }
}
exports.PreferencesService = PreferencesService;
exports.default = PreferencesService;
//# sourceMappingURL=PreferencesService.js.map