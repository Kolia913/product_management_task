-- DropForeignKey
ALTER TABLE "ArrivalDocumentProduct" DROP CONSTRAINT "ArrivalDocumentProduct_document_id_fkey";

-- DropForeignKey
ALTER TABLE "ArrivalDocumentProduct" DROP CONSTRAINT "ArrivalDocumentProduct_product_id_fkey";

-- DropForeignKey
ALTER TABLE "PrimeCost" DROP CONSTRAINT "PrimeCost_product_id_fkey";

-- DropForeignKey
ALTER TABLE "SaleDocumentProduct" DROP CONSTRAINT "SaleDocumentProduct_document_id_fkey";

-- DropForeignKey
ALTER TABLE "SaleDocumentProduct" DROP CONSTRAINT "SaleDocumentProduct_product_id_fkey";

-- AddForeignKey
ALTER TABLE "PrimeCost" ADD CONSTRAINT "PrimeCost_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArrivalDocumentProduct" ADD CONSTRAINT "ArrivalDocumentProduct_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "ArrivalDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArrivalDocumentProduct" ADD CONSTRAINT "ArrivalDocumentProduct_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleDocumentProduct" ADD CONSTRAINT "SaleDocumentProduct_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "SaleDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleDocumentProduct" ADD CONSTRAINT "SaleDocumentProduct_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
