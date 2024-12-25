import p from "path";

export function encryptImage(base64Image: string, key: string) {
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");

    const repeatingKey = key.repeat(Math.ceil(base64Data.length / key.length))
    .slice(0, base64Data.length);

    const encrypted = base64Data
      .split('')
      .map((char, i) => {
        const shift = repeatingKey.charCodeAt(i);
        return String.fromCharCode((char.charCodeAt(0) + shift) % 65536);
      })
      .join('');

    return encrypted
  }

export function decryptImage(encryptedImage: string, key: string) {
    try{
        const repeatingKey = key.repeat(Math.ceil(encryptedImage.length / key.length))
        .slice(0, encryptedImage.length);

        const decrypted = encryptedImage
            .split('')
            .map((char, i) => {
            const shift = repeatingKey.charCodeAt(i);
            return String.fromCharCode((char.charCodeAt(0) - shift + 65536) % 65536);
            })
            .join('');
        if(!atob(decrypted))
        {
           throw new Error()
        }
        return `data:image/png;base64,${decrypted}`;
    }catch (e)
    {
        throw new Error("Invalid key")
    }
}

export function crackVigenereCipher(encryptedImage: string) {
    const fs = require('fs');
    const currentDir = process.cwd();
    const path = p.join(currentDir, "src/ciphers/utils/common-pw.txt");
    const base64Data = encryptedImage.replace(/^data:image\/\w+;base64,/, "");
    const logs = [];
    try {

        const passwords = fs.readFileSync(path, 'utf8').split('\n');
        for (const password of passwords) {
            const key = password.trim();
            if (!key) continue;

            const decrypted = base64Data
                .split('')
                .map((char, i) => {
                    const shift = key.charCodeAt(i % key.length);
                    return String.fromCharCode((char.charCodeAt(0) - shift + 65536) % 65536);
                })
                .join('');

            try {
                atob(decrypted);
                logs.push(`key: ${key} succeeded`)
                const image = `data:image/png;base64,${decrypted}`;
                return { logs, image };
            } catch (e) {
                logs.push(`key: ${key} failed`);
            }
        }
    } catch (e) {
        logs.push("Error reading password file");
    }

    logs.push("Failed to crack the Vigenere cipher");
    return { logs, image: "" };
}