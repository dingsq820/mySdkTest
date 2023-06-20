import { Secp256kPrivateJwk } from 'dw-did-sdk';
export declare class PrivateKeyModel {
    id: string;
    privateKey: Secp256kPrivateJwk;
    constructor(id: string, privateKey: Secp256kPrivateJwk);
}
export default PrivateKeyModel;
