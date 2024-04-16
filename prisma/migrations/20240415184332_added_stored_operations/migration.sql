-- CreateTable
CREATE TABLE "StoredOperations" (
    "id" UUID NOT NULL,
    "operation_date" TIMESTAMPTZ NOT NULL,
    "product_id" UUID NOT NULL,

    CONSTRAINT "StoredOperations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StoredOperations_id_key" ON "StoredOperations"("id");

-- AddForeignKey
ALTER TABLE "StoredOperations" ADD CONSTRAINT "StoredOperations_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
