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
  const gcd = (x: number, y: number): number => {
    return y === 0 ? x : gcd(y, x % y);
  };
  const keyNum = Number(key)
  return gcd(keyNum, 65536) === 1;
}