const cartModel = require("../models/cartModel");
const orderModel = require("../models/order.Model");
const productsModel = require("../models/productsModel");

exports.orderNow = async (req, res) => {
  try {
    const { userId, items, totalAmount } = req.body;

    if (!userId || !items || !totalAmount) {
      return res
        .status(400)
        .json({ message: "User ID, Items, and Total Amount are required." });
    }

    for (let i = 0; i < items.length; i++) {
      const product = await productsModel.findById(items[i].productId);
      if (!product) {
        return res.status(404).json({
          message: `Product not found with ID: ${items[i].productId}`,
        });
      }

      product.SoldCount += items[i].quantity;
      await product.save();
    }

    const newOrder = new orderModel({
      userId,
      items,
      totalAmount,
      orderDate: new Date(),
    });

    await newOrder.save();

    await cartModel.findOneAndUpdate(
      { userId },
      { $set: { items: [] } },
      { new: true }
    );

    res.status(200).json({
      message: "Order placed successfully, and cart is now empty.",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res
      .status(500)
      .json({ message: "An error occurred while placing the order." });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find()
      .populate("userId", "name email")
      .populate("items.productId", "name price image")
      .exec();

    if (!orders) {
      return res.status(404).json({ message: "No orders found." });
    }

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching orders." });
  }
};
