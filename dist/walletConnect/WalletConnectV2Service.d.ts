import { ErrorResponse, JsonRpcResponse } from '@walletconnect/jsonrpc-utils';
import { PairingTypes, SessionTypes } from '@walletconnect/types';
import { IWeb3Wallet, Web3WalletTypes } from '@walletconnect/web3wallet';
export declare class WalletConnectV2Service {
    private projectId;
    private relayUrl;
    private metadata;
    private web3Wallet;
    /**
     * Creates a WalletConnectV2Service instance.
     * @param connectorOpts - wallet connect options.
     */
    constructor(projectId: string, relayUrl: string, metadata: Web3WalletTypes.Metadata);
    /**
     * Create a web3 wallet client.
     */
    createWeb3WalletClient(): Promise<void>;
    /**
     * Get a web3 wallet client.
     * @returns
     */
    getWeb3WalletClient(): Promise<IWeb3Wallet | undefined>;
    /**
     * Pari.
     * @param wcuri a wallet connect uri.
     * @returns pair result.
     */
    pair(wcuri: string): Promise<PairingTypes.Struct | undefined>;
    /**
     * Subscribe to session proposal.
     * @param callback - Handle Call Request
     */
    onSessionProposal(callback: (args: Web3WalletTypes.EventArguments['session_proposal']) => void): void;
    /**
     * Subscribe to session request
     * @param callback - Handle Call Request
     */
    onSessionRequest(callback: (args: Web3WalletTypes.EventArguments['session_request']) => void): void;
    /**
     * Subscribe to session delete
     * @param callback - Handle Call Request
     */
    onSessionDelete(callback: (args: Web3WalletTypes.EventArguments['session_delete']) => void): void;
    /**
     * Subscribe to approve session
     * @param params - approve info.
     */
    approveSession(params: {
        id: number;
        namespaces: Record<string, SessionTypes.Namespace>;
        relayProtocol?: string;
    }): Promise<SessionTypes.Struct | undefined>;
    /**
     * Subscribe to reject session
     * @param params - reject info.
     */
    rejectSession(params: {
        id: number;
        reason: ErrorResponse;
    }): Promise<void>;
    updateSession(params: {
        topic: string;
        namespaces: SessionTypes.Namespaces;
    }): Promise<void>;
    /**
     * Subscribe to disconnect session
     * @param params - disconnect session info.
     */
    disconnectSession(params: {
        topic: string;
        reason: ErrorResponse;
    }): Promise<void>;
    respondSessionRequest(params: {
        topic: string;
        response: JsonRpcResponse;
    }): Promise<void>;
    /**
     * Get the active sessions.
     * @returns
     */
    getActiveSessions(): SessionTypes.Struct[] | undefined;
    /**
     * Get the session by topic.
     * @param topic
     * @returns
     */
    getCurrentSessionByTopic(topic: string | undefined): SessionTypes.Struct | undefined;
    /**
     * emit session event.
     * @param params
     */
    emitSessionEvent(params: {
        topic: string;
        event: unknown;
        chainId: string;
    }): Promise<void>;
    /**
     * disconnect all sessions.
     */
    disconnectAllSessions(reason: ErrorResponse): Promise<void>;
}
export default WalletConnectV2Service;
