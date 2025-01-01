const mongoose = require("mongoose");
const ProductSchma = mongoose.Schema({
  name: {
    type: String,
    default: null,
  },
  description: {
    type: String,
    default: null,
  },
  price: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
  },
  SoldCount: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("products", ProductSchma);
