import type { IClientMeta, IJsonRpcResponseError, IJsonRpcResponseSuccess, IParseURIResult, ISessionError, ISessionStatus, IWalletConnectOptions } from '@walletconnect/legacy-types';
/**
 * Controller responsible for managing walletConnect
 */
export declare class WalletConnectService {
    private walletConnector;
    /**
     * Creates a WalletConnectService instance.
     * @param connectorOpts - wallet connect options.
     */
    constructor(connectorOpts: IWalletConnectOptions);
    /**
     * Subscribe to session requests
     * @param callback - Handle Session Request
     */
    onSessionRequest(callback: (error: Error | null, payload: any | null) => void): void;
    /**
     * Subscribe to call requests
     * @param callback - Handle Call Request
     */
    onCallRequest(callback: (error: Error | null, payload: any | null) => void): void;
    /**
     * Subscribe to disconnect
     * @param callback - Handle disconnect
     */
    onDisconnect(callback: (error: Error | null, payload: any | null) => void): void;
    /**
     * Subscribe to update session
     * @param callback - Handle update session
     */
    onSessionUpdate(callback: (error: Error | null, payload: any | null) => void): void;
    /**
     * Subscribe to approve request
     * @param response - json rpc response success
     */
    approveRequest(response: Partial<IJsonRpcResponseSuccess>): void;
    /**
     * Subscribe to reject request
     * @param response - json rpc response error
     */
    rejectRequest(response: Partial<IJsonRpcResponseError>): void;
    /**
     * Subscribe to update session
     * @param sessionStatus - session status
     */
    updateSession(sessionStatus: ISessionStatus): void;
    /**
     * Subscribe to approve session
     * @param sessionStatus - session status
     */
    approveSession(sessionStatus: ISessionStatus): void;
    /**
     * Subscribe to reject session
     * @param sessionError - session error
     */
    rejectSession(sessionError?: ISessionError): void;
    /**
     * Subscribe to kill session
     */
    killSession(): void;
    /**
     * Subscribe to get session
     */
    getSession(): {
        connected: boolean;
        accounts: string[];
        chainId: number;
        bridge: string;
        key: string;
        clientId: string;
        clientMeta: IClientMeta | null;
        peerId: string;
        peerMeta: IClientMeta | null;
        handshakeId: number;
        handshakeTopic: string;
    };
    /**
     * Subscribe to get connect
     */
    getConnected(): boolean;
    /**
     * parse wallet connect uri
     * @param str - wallet connect uri
     * @returns parse uri result
     */
    static parseWalletConnectUri(str: string): IParseURIResult;
}
export default WalletConnectService;
