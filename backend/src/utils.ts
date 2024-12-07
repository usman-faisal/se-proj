import {decryptImage as caesarDecryptImage,  encryptImage as caesarEncryptImage, crackCaesarCipher} from "./ciphers/caesar";
import {crackVigenereCipher, decryptImage as vigenereDecryptImage,  encryptImage as vigenereEncryptImage} from "./ciphers/vigenere";
import {decryptImage as multiplicativeDecryptImage, encryptImage as multiplicativeEncryptImage, crackMultiplicativeCipher} from "./ciphers/multiplicative";
import { Response } from "express";
import { CipherType } from "./types";
import { Cipher } from "@prisma/client";

interface crackOutput {
    logs: string [];
    image: string;
}
interface ChooseCipherObj {
    encryptImage: (base64Image: string, key: string) => string
    decryptImage: (encryptedImage: string, key: string) => string
    crackCipher: (encryptedImage: string) => crackOutput;
}
export const chooseCipher = (cipher: Cipher = CipherType.Caesar): ChooseCipherObj => {
    switch (cipher) {
        case "Caesar":
            return {encryptImage: caesarEncryptImage, decryptImage: caesarDecryptImage, crackCipher: crackCaesarCipher};
        case "Vigenere":
            return {encryptImage: vigenereEncryptImage, decryptImage: vigenereDecryptImage, crackCipher: crackVigenereCipher};
        case "Multiplicative":
            return {encryptImage: multiplicativeEncryptImage, decryptImage: multiplicativeDecryptImage, crackCipher: crackMultiplicativeCipher};
        default:
            throw new Error("Invalid cipher");
    }
}
