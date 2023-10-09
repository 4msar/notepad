/**
 * https://stackoverflow.com/questions/18279141/javascript-string-encryption-and-decryption
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ENCRYPTION_KEY } from "./constant";

import CryptoJS from "crypto-js";

export function encryptData(string: string) {
    return CryptoJS.AES.encrypt(string, ENCRYPTION_KEY).toString();
}
export function decryptData(string: string) {
    const bytes = CryptoJS.AES.decrypt(string, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
}
