const express = require("express");
const router = express.Router();
const controller = require("../Controllers/order.controller");
router.post("/order", controller.orderNow);
router.get("/get-all-orders", controller.getAllOrders);
module.exports = router;
