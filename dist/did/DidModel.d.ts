import { DidKeyPair, DidObject } from 'dw-did-sdk';
declare class DidModel extends DidObject {
    id: string;
    constructor(scheme: string, method: string, didSuffix: string, longFormSuffixData: string, signingKeyId: string, published: boolean, keys: {
        signing: DidKeyPair;
        update?: DidKeyPair;
        recovery?: DidKeyPair;
    });
    static ID: string;
    static createByDidObject(didObject: DidObject): DidModel;
}
export default DidModel;
