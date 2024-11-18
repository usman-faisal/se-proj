export function encryptAndBlurImage(base64Image: string, key: string) {
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
  const repeatingKey = key.repeat(Math.ceil(encryptedImage.length / key.length))
                         .slice(0, encryptedImage.length);
  
  const decrypted = encryptedImage
    .split('')
    .map((char, i) => {
      const shift = repeatingKey.charCodeAt(i);
      return String.fromCharCode((char.charCodeAt(0) - shift + 65536) % 65536);
    })
    .join('');

    // add the base64 prefix
    return `data:image/png;base64,${decrypted}`;

}