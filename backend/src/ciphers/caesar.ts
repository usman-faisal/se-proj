// caesar cipher
import { Response } from "express";

export const encryptImage = (base64Image: string, key: string) => {
    const keyNum = parseInt(key);
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const encrypted = base64Data
        .split('')
        .map((char) => {
        return String.fromCharCode((char.charCodeAt(0) + keyNum) % 65536);
        })
        .join('');
    return encrypted;
}


export const decryptImage = (encryptedImage: string, key: string) => {
    const keyNum = parseInt(key);
    const decrypted = encryptedImage
        .split('')
        .map((char) => {
        return String.fromCharCode((char.charCodeAt(0) - keyNum + 65536) % 65536);
        })
        .join('');
    return `data:image/png;base64,${decrypted}`;
}

export const crackCaesarCipher = (encryptedImage: string) => {
    const base64Data = encryptedImage.replace(/^data:image\/\w+;base64,/, "");
    const logs = []
    for (let key = 0; key < 65536; key++) {
        const decrypted = base64Data
            .split('')
            .map((char) => {
                return String.fromCharCode((char.charCodeAt(0) - key + 65536) % 65536);
            })
            .join('');
        try {
            atob(decrypted);
            logs.push(`key: ${key} succeeded`)
            const image = `data:image/png;base64,${decrypted}`;
            return {logs, image}
        } catch (e) {
            logs.push(`key: ${key} failed`)
        }
    }

    logs.push("Failed to crack the caesar cipher")
    return {logs, image: ""}
}
