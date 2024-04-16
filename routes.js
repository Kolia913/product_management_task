const { Router } = require("express");

const { storeProduct } = require("./controllers/products.controller");
const { storeArrival } = require("./controllers/arrivals.controller");
const { storeSale } = require("./controllers/sales.controller");
const { getProductPrice } = require("./controllers/price.controller");

const router = Router();

router.post("/products", storeProduct);
router.post("/arrivals", storeArrival);
router.post("/orders", storeSale);

router.get("/cost/:id", getProductPrice);

// router.get("/report", (req, res) => {});

module.exports = {
  router,
};
