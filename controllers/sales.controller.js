const dayjs = require("dayjs");
const { prisma } = require("../dbClient");

async function storeSale(req, res) {
  try {
    const body = req.body;

    const saleDocumentProducts = req.body.products;

    const transactionRes = await prisma.$transaction(async (tx) => {
      const saleDoc = await tx.saleDocument.create({
        data: {
          date: body.date,
        },
      });
      const productsRes = await tx.saleDocumentProduct.createMany({
        data: [
          ...saleDocumentProducts.map((item) => ({
            document_id: saleDoc.id,
            product_id: item.product_id,
            price: item.price,
            quantity: item.quantity,
          })),
        ],
      });
      await tx.storedOperations.createMany({
        data: [
          ...saleDocumentProducts.map((item) => ({
            operation_date: body.date,
            product_id: item.product_id,
            prev_month: dayjs(body.date).subtract(1, "month").toISOString(),
          })),
        ],
        skipDuplicates: true,
      });
      return {
        ...saleDoc,
        productsCount: productsRes.count,
      };
    });

    res.status(201).json(transactionRes);
  } catch (e) {
    res.status(500).send("Internal server error!");
    console.log(e);
  }
}

module.exports = {
  storeSale,
};
