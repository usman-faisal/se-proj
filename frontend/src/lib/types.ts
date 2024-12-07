export interface Url {
    id: string
    url: string
    image: string;
}

export enum CipherType {
    Caesar = "Caesar",
    Multiplicative = "Multiplicative",
    Vigenere = "Vigenere"
}