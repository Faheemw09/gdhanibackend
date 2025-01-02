const express = require("express");
const router = express.Router();
const controller = require("../Controllers/cart.controller");
router.post("/add-to-cart", controller.addToCart);
router.get("/user-cart/:userId", controller.getCartByUserId);
router.delete("/remove-cart", controller.removeFromCart);
module.exports = router;
