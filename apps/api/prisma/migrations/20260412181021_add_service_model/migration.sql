-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name_ua" TEXT,
    "name_en" TEXT,
    "category" TEXT,
    "description_ua" TEXT,
    "description_en" TEXT,
    "country" TEXT,
    "city" TEXT,
    "price_from" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "duration" TEXT,
    "image_url" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "meta_title_ua" TEXT,
    "meta_title_en" TEXT,
    "meta_description_ua" TEXT,
    "meta_description_en" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "services_slug_key" ON "services"("slug");
