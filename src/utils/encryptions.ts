import { ENCRYPTION_KEY } from "./constant";

export const cipher = (salt: string) => {
    const textToChars = (text: string) =>
        text.split("").map((c) => c.charCodeAt(0));
    const byteHex = (n: string) => ("0" + Number(n).toString(16)).substring(-2);
    const applySaltToChar = (code: any) =>
        textToChars(salt).reduce((a, b) => a ^ b, code);

    return (text: string) =>
        text
            .split("")
            .map(textToChars)
            .map(applySaltToChar)
            .map(byteHex)
            .join("");
};

export const decipher = (salt: string) => {
    const textToChars = (text: string) =>
        text.split("").map((c) => c.charCodeAt(0));
    const applySaltToChar = (code: any) =>
        textToChars(salt).reduce((a, b) => a ^ b, code);
    return (encoded: any) =>
        encoded
            .match(/.{1,2}/g)
            .map((hex: string) => parseInt(hex, 16))
            .map(applySaltToChar)
            .map((charCode: number) => String.fromCharCode(charCode))
            .join("");
};

/*
// Usages
// To create a cipher
const myCipher = cipher('mySecretSalt')

//Then cipher any text:
myCipher('the secret string')   // --> "7c606d287b6d6b7a6d7c287b7c7a61666f"

//To decipher, you need to create a decipher and use it:
const myDecipher = decipher('mySecretSalt')
myDecipher("7c606d287b6d6b7a6d7c287b7c7a61666f")

*/

export function encryptData(string: string) {
    const myCipher = cipher(ENCRYPTION_KEY);
    return myCipher(string);
}
export function decryptData(string: string) {
    const myDecipher = decipher(ENCRYPTION_KEY);
    return myDecipher(string);
}
