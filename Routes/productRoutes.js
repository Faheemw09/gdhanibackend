const express = require("express");
const router = express.Router();
const controller = require("../Controllers/product.controller");
const upload = require("../multer/multerConfig");

router.post(
  "/create-product",
  upload.single("image"),
  controller.CreateProduct
);
router.get("/get-all-products", controller.getAll);
router.patch(
  "/update-product/:id",
  upload.single("image"),
  controller.updateProduct
);
router.delete("/delete-product/:id", controller.productDelete);
module.exports = router;
