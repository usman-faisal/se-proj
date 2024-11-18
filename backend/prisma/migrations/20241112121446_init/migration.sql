/*
  Warnings:

  - You are about to drop the column `blurred_image` on the `url` table. All the data in the column will be lost.
  - You are about to drop the column `original_image` on the `url` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `url` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[url]` on the table `url` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `url` to the `url` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "url_slug_key";

-- AlterTable
ALTER TABLE "url" DROP COLUMN "blurred_image",
DROP COLUMN "original_image",
DROP COLUMN "slug",
ADD COLUMN     "image" TEXT,
ADD COLUMN     "url" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "url_url_key" ON "url"("url");
