/// <reference types="node" />
import { EthereumRpcError } from 'eth-rpc-errors';
import { EventEmitter } from 'events';
import { PersonalMessage, PersonalMessageParams, TypedMessage, TypedMessageParams } from '../account/MessageType';
import { AbstractAdapter, IConfig, IState } from '../core/AbstractAdapter';
import { AbstractService } from '../core/AbstractService';
declare type Json = null | boolean | number | string | Json[] | {
    [prop: string]: Json;
};
declare type ApprovalRequestData = Record<string, Json> | null;
export declare type ApprovalRequest<RequestData extends ApprovalRequestData> = {
    id: string;
    origin: string;
    time: number;
    type: string;
    requestData: RequestData;
};
declare type ShowApprovalRequest = () => void | Promise<void>;
declare type AddApprovalOptions = {
    id?: string;
    origin: string;
    type: string;
    requestData?: Record<string, Json>;
};
export interface ApprovalState extends IState {
    pendingApprovals: Record<string, ApprovalRequest<Record<string, Json>>>;
    pendingApprovalCount: number;
    unapprovedMessages: {
        [key: string]: PersonalMessage;
    };
    unapprovedMessagesCount: number;
    unapprovedTypeMessages: {
        [key: string]: TypedMessage;
    };
    unapprovedTypeMessagesCount: number;
}
export interface ApprovalConfig extends IConfig {
    showApprovalRequest: ShowApprovalRequest;
}
export interface OriginalRequest {
    origin?: string;
}
export declare class ApprovalService<A extends AbstractAdapter<ApprovalState, ApprovalConfig>> extends AbstractService<A, ApprovalState, ApprovalConfig> {
    name: string;
    private _approvals;
    private _origins;
    /**
     * message event instance
     */
    hub: EventEmitter;
    protected messages: PersonalMessage[];
    protected typeMessages: TypedMessage[];
    initialize(config?: Partial<ApprovalConfig>, state?: Partial<ApprovalState> | undefined): void;
    private _isEmptyOrigin;
    private _validateAddParams;
    private _addPendingApprovalOrigin;
    private _addToStore;
    private _add;
    private _delete;
    private _deleteApprovalAndGetCallbacks;
    add(opts: AddApprovalOptions): Promise<unknown>;
    get(id: string): ApprovalRequest<ApprovalRequestData> | undefined;
    accept(id: string, value?: unknown): void;
    reject(id: string, error: unknown): void;
    clear(rejectionError: EthereumRpcError<unknown>): void;
    /**
     * the number of 'unapproved' Messages in this.messages.
     */
    getUnapprovedMessagesCount(): number;
    getUnapprovedTypeMessagesCount(): number;
    /**
     * the 'unapproved' Messages in state messages.
     */
    getUnapprovedMessages(): {
        [key: string]: PersonalMessage;
    };
    /**
     * the 'unapproved' Messages in state messages.
     */
    getUnapprovedTypeMessages(): {
        [key: string]: TypedMessage;
    };
    addMessage(message: PersonalMessage): void;
    addTypeMessage(message: TypedMessage): void;
    /**
     * Saves the unapproved messages and count to state.
     *
     */
    saveMessageList(): void;
    saveTypeMessageList(): void;
    getMessage(messageId: string): PersonalMessage | undefined;
    getTypeMessage(messageId: string): TypedMessage | undefined;
    updateMessage(message: PersonalMessage): void;
    updateTypeMessage(message: TypedMessage): void;
    setMessageStatus(messageId: string, status: string): void;
    setTypeMessageStatus(messageId: string, status: string): void;
    addUnapprovedMessageAsync(messageParams: PersonalMessageParams, req?: OriginalRequest): Promise<string>;
    addUnapprovedMessage(messageParams: PersonalMessageParams, req?: OriginalRequest): any;
    addUnapprovedTypeMessageAsync(messageParams: TypedMessageParams, req?: OriginalRequest): Promise<string>;
    addUnapprovedTypeMessage(messageParams: TypedMessageParams, req?: OriginalRequest): any;
    setMessageStatusSigned(messageId: string, rawSig: string): void;
    prepMessageForSigning(messageParams: PersonalMessageParams): Promise<PersonalMessageParams>;
    setMessageStatusApproved(messageId: string): void;
    approveMessage(messageParams: PersonalMessageParams): Promise<PersonalMessageParams>;
    rejectMessage(messageId: string): void;
    setTypeMessageStatusSigned(messageId: string, rawSig: string): void;
    prepTypeMessageForSigning(messageParams: TypedMessageParams): Promise<TypedMessageParams>;
    setTypeMessageStatusApproved(messageId: string): void;
    approveTypeMessage(messageParams: TypedMessageParams): Promise<TypedMessageParams>;
    rejectTypeMessage(messageId: string): void;
}
export default ApprovalService;
