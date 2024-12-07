import { Response } from "express";

const modInverse = (a: number, m: number): number => {
    for (let x = 1; x < m; x++) {
        if (((a % m) * (x % m)) % m === 1) {
            return x;
        }
    }
    throw new Error("Modular multiplicative inverse does not exist");
}

const isCoprime = (a: number, b: number): boolean => {
    const gcd = (x: number, y: number): number => {
        return y === 0 ? x : gcd(y, x % y);
    };
    return gcd(a, b) === 1;
}

export const encryptImage = (base64Image: string, key: string) => {
    const keyNum = parseInt(key);
    if (!isCoprime(keyNum, 65536)) {
        throw new Error("Key must be coprime with 65536");
    }
    
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const encrypted = base64Data
        .split('')
        .map((char) => {
            return String.fromCharCode((char.charCodeAt(0) * keyNum) % 65536);
        })
        .join('');
    return encrypted;
}

export const decryptImage = (encryptedImage: string, key: string) => {
    const keyNum = parseInt(key);
    if (!isCoprime(keyNum, 65536)) {
        throw new Error("key must be coprime with 65536");
    }
    
    const inverse = modInverse(keyNum, 65536);
    const decrypted = encryptedImage
        .split('')
        .map((char) => {
            return String.fromCharCode((char.charCodeAt(0) * inverse) % 65536);
        })
        .join('');
    return `data:image/png;base64,${decrypted}`;
}

export const crackMultiplicativeCipher = (encryptedImage: string) => {
    const base64Data = encryptedImage.replace(/^data:image\/\w+;base64,/, "");
    const logs = []
    for (let key = 1; key < 65536; key++) {
        if (!isCoprime(key, 65536)) continue;
        
        const inverse = modInverse(key, 65536);
        const decrypted = base64Data
            .split('')
            .map((char) => {
                return String.fromCharCode((char.charCodeAt(0) * inverse) % 65536);
            })
            .join('');
        try {
            atob(decrypted);
            logs.push(`key: ${key} succeeded`)
            const image = `data:image/png;base64,${decrypted}`;
            return {image, logs}
        } catch (e) {
            logs.push(`key: ${key} failed`)
        }
    }
    logs.push("Failed to crack the multiplicative cipher")
    return {
        image: "",
        logs
    }
}
