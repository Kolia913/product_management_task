/*
  Warnings:

  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `name` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - Changed the type of `id` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Product" DROP CONSTRAINT "Product_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
ADD CONSTRAINT "Product_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "PrimeCost" (
    "product_id" UUID NOT NULL,
    "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "value" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PrimeCost_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "ArrivalDocument" (
    "id" UUID NOT NULL,
    "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArrivalDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleDocument" (
    "id" UUID NOT NULL,
    "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SaleDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArrivalDocumentProduct" (
    "document_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,

    CONSTRAINT "ArrivalDocumentProduct_pkey" PRIMARY KEY ("document_id","product_id")
);

-- CreateTable
CREATE TABLE "SaleDocumentProduct" (
    "document_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,

    CONSTRAINT "SaleDocumentProduct_pkey" PRIMARY KEY ("document_id","product_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ArrivalDocument_id_key" ON "ArrivalDocument"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SaleDocument_id_key" ON "SaleDocument"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Product_id_key" ON "Product"("id");

-- AddForeignKey
ALTER TABLE "PrimeCost" ADD CONSTRAINT "PrimeCost_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArrivalDocumentProduct" ADD CONSTRAINT "ArrivalDocumentProduct_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "ArrivalDocument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArrivalDocumentProduct" ADD CONSTRAINT "ArrivalDocumentProduct_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleDocumentProduct" ADD CONSTRAINT "SaleDocumentProduct_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "SaleDocument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleDocumentProduct" ADD CONSTRAINT "SaleDocumentProduct_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
