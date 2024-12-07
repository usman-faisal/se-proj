/*
  Warnings:

  - You are about to drop the column `iv` on the `url` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Cipher" AS ENUM ('Vigenere', 'Caesar', 'Multiplicative');

-- AlterTable
ALTER TABLE "url" DROP COLUMN "iv",
ADD COLUMN     "cipher" "Cipher";
