const { Prisma } = require("@prisma/client");
const { prisma } = require("../dbClient");

async function storeProduct(req, res) {
  try {
    /** @type {Prisma.ProductCreateInput} */
    const body = req.body;
    const queryRes = await prisma.product.create({
      data: {
        id: body.id,
        name: body.name,
      },
    });

    res.status(201).json(queryRes);
  } catch (e) {
    console.log(e);
    res.status(500).send("Internal server error!");
  }
}

module.exports = {
  storeProduct,
};
