import { PersonalMessageParams } from '../account/MessageType';
/**
 * Validates that the input is a hex address.
 *
 * @param address - Input address.
 * @param options - The validation options.
 * @param options.allowNonPrefixed - If true will first ensure '0x' is prepended to the string.
 * @returns Whether or not the input is a valid hex address.
 */
export declare function isValidHexAddress(address: string, { allowNonPrefixed }?: {
    allowNonPrefixed?: boolean | undefined;
}): boolean;
/**
 * Validates a PersonalMessageParams.
 */
export declare function validateSignMessageData(messageData: PersonalMessageParams): void;
/**
 * Converts rawmessageData buffer data to a hex,
 * or just returns the data if it is already formatted as a hex.
 *
 * @param data - The buffer data to convert to a hex.
 * @returns A hex string conversion of the buffer data.
 */
export declare function normalizeMessageData(data: string): string;
/**
 * Converts hex data to human readable string.
 *
 * @param hex - The hex string to convert to string.
 * @returns A human readable string conversion.
 */
export declare function hexToText(hex: string): string;
