const express = require("express");
const ordersController = require("../controllers/orders-controllers");

const router = express.Router();

router.get("/", ordersController.getOrder);

router.post("/", ordersController.addOrder);

router.get("/success", ordersController.getSuccess);

router.get("/failure", ordersController.getFailure);

module.exports = router;
