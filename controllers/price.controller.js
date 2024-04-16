const { prisma } = require("../dbClient");

async function getProductPrice(req, res) {
  const id = req.params.id;

  try {
    const primeCost = await prisma.primeCost.findFirst({
      where: {
        product_id: id,
      },
      include: {
        product: {
          select: {
            name: true,
          },
        },
      },
    });

    return res.status(200).json(primeCost);
  } catch (e) {
    res.status(500).send("Internal server error!");
  }
}

module.exports = {
  getProductPrice,
};
