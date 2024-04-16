/*
  Warnings:

  - Added the required column `price` to the `ArrivalDocumentProduct` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `ArrivalDocumentProduct` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `SaleDocumentProduct` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `SaleDocumentProduct` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ArrivalDocumentProduct" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "SaleDocumentProduct" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL;
