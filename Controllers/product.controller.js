const productsModel = require("../models/productsModel");
const fs = require("fs");
const path = require("path");

exports.CreateProduct = async (req, res) => {
  const { name, price, description, SoldCount, discount } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    const newproduct = new productsModel({
      name,
      price,
      description,
      image,
      SoldCount,
      discount,
    });

    await newproduct.save();
    res.status(200).send({
      msg: "Product added sucessfully",
      data: newproduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    const products = await productsModel.find({});
    return res.status(200).send({
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.updateProduct = async (req, res) => {
  const { name, description, price, discount } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : undefined;

  try {
    const product = await productsModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (discount) product.discount = discount;

    if (image) {
      if (product.image) {
        const oldImagePath = path.join(process.cwd(), product.image);
        try {
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        } catch (err) {
          console.error("Error deleting old image:", err.message);
        }
      }
      product.image = image;
    }

    const updatedProduct = await product.save();
    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update product" });
  }
};

exports.productDelete = async (req, res) => {
  try {
    const product = await productsModel.findByIdAndDelete(req.params.id);

    if (product && product.image) {
      const imagePath = path.join(process.cwd(), product.image);
      try {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      } catch (err) {
        console.error("Error deleting image:", err.message);
      }
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};
