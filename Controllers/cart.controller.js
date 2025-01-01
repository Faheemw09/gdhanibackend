const cartModel = require("../models/cartModel");
const productsModel = require("../models/productsModel");

exports.addToCart = async (req, res) => {
  try {
    const { userId, productId } = req.body; // No need for quantity anymore

    // Find the product by its ID
    const product = await productsModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find the user's cart
    let cart = await cartModel.findOne({ userId });

    if (!cart) {
      cart = new cartModel({
        userId,
        items: [{ productId, quantity: 1 }],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId
      );
      if (existingItem) {
        return res
          .status(400)
          .json({ message: "Product is already in the cart" });
      } else {
        cart.items.push({ productId, quantity: 1 });
      }
    }

    await cart.save();
    return res.status(200).json({ message: "Product added to cart", cart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getCartByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log;
    const cart = await cartModel
      .findOne({ userId })
      .populate("items.productId", "name price image discount"); // Populate product details like name, price, image, and discount

    if (!cart) {
      return res.status(404).json({ message: "Cart not found for this user" });
    }

    return res.status(200).json({ cart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
