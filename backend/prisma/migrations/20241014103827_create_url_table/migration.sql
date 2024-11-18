-- CreateTable
CREATE TABLE "url" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "blurred_image" TEXT,
    "original_image" TEXT,
    "key" TEXT,

    CONSTRAINT "url_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "url_slug_key" ON "url"("slug");
