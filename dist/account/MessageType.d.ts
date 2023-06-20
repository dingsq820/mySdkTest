/**
 * @type Message
 *
 * A signing type signature request.
 * @property id - An id to track and identify the message object
 * @property type - The json-prc signing method for which a signature request has been made.
 * A 'Message' which always has a signing type
 * @property rawSig - Raw data of the signature request
 */
export interface AbstractMessage {
    id: string;
    time: number;
    status: string;
    type: string;
    rawSig?: string;
}
/**
 * @type Message
 *
 * A 'personal_sign' type signature request.
 * @property messageParams - The parameters to pass to the personal_sign method once the signature request is approved
 */
export interface PersonalMessage extends AbstractMessage {
    messageParams: PersonalMessageParams;
}
/**
 * @type TypedMessage
 *
 * A 'eth_signTypedData' type signature request.
 * @property messageParams - The parameters to pass to the eth_signTypedData method once the signature request is approved
 */
export interface TypedMessage extends AbstractMessage {
    messageParams: TypedMessageParams;
}
/**
 * @type MessageParams
 *
 * Parameters to pass to the signing method once the signature request is approved.
 * @property from - Address to sign this message from
 * @property origin? - Added for request origin identification
 */
export interface AbstractMessageParams {
    from: string;
    origin?: string;
}
/**
 * @type PersonalMessageParams
 *
 * Parameters to pass to the personal_sign method once the signature request is approved.
 * @property messageId - identification within wallet
 * @property data - A hex string conversion of the raw buffer data of the signature request
 */
export interface PersonalMessageParams extends AbstractMessageParams {
    messageId?: string;
    data: string;
}
/**
 * @type TypedMessageParams
 *
 * Parameters to pass to the eth_signTypedData method once the signature request is approved.
 * @property data - A hex string conversion of the raw buffer or an object containing data of the signature
 * request depending on version
 */
export interface TypedMessageParams extends AbstractMessageParams {
    messageId?: string;
    data: Record<string, unknown>[] | string;
}
