const express = require("express");
const cors = require("cors");
const { connection } = require("./db");
const app = express();
app.use(cors());
app.use(express.json());
require("dotenv").config();
const userRoutes = require("./Routes/user.routes");
const cartRoutes = require("./Routes/cart.routes");
const productsRoutes = require("./Routes/productRoutes");
const orderRoutes = require("./Routes/order.routes");
app.use("/api", userRoutes);
app.use("/api", productsRoutes);
app.use("/api", cartRoutes);
app.use("/api", orderRoutes);
app.use("/uploads", express.static("uploads"));

app.listen(process.env.port, async () => {
  console.log("backend is running ");
  try {
    await connection;
    console.log("backend connected to database");
  } catch (error) {
    console.log(error);
    console.log("error getting to connect with data base");
  }
});
