import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { CipherType } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const validateKey = (cipherType: CipherType, key: string) => {
  if (cipherType === CipherType.Vigenere) {
    return true;
  }
  const keyNum = parseInt(key);
  return keyNum > 0 && keyNum <= 65536;
}