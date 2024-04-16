const dayjs = require("dayjs");
const { prisma } = require("../dbClient");

async function storeArrival(req, res) {
  try {
    const body = req.body;

    const arrivalDocumentProducts = req.body.products;

    const transactionRes = await prisma.$transaction(async (tx) => {
      const arrivalDoc = await tx.arrivalDocument.create({
        data: {
          date: body.date,
        },
      });
      const productsRes = await tx.arrivalDocumentProduct.createMany({
        data: [
          ...arrivalDocumentProducts.map((item) => ({
            document_id: arrivalDoc.id,
            product_id: item.product_id,
            price: item.price,
            quantity: item.quantity,
          })),
        ],
        skipDuplicates: true,
      });
      await tx.storedOperations.createMany({
        data: [
          ...arrivalDocumentProducts.map((item) => ({
            operation_date: body.date,
            product_id: item.product_id,
            prev_month: dayjs(body.date).subtract(1, "month").toISOString(),
          })),
        ],
        skipDuplicates: true,
      });
      return {
        ...arrivalDoc,
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
  storeArrival,
};
