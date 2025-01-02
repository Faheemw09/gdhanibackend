const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModels = require("../models/userModels");
const productsModel = require("../models/productsModel");
const orderModel = require("../models/order.Model");
exports.Signup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const emailExits = await userModels.findOne({ email });
    if (emailExits) {
      return res.status(400).json({
        message: "Email already exists.",
      });
    }
    const hashedpassword = await bcrypt.hash(password, 5);
    const createUser = new userModels({
      name,
      email,
      password: hashedpassword,
    });
    await createUser.save();
    res.status(200).json({
      message: "signup Sucessfully",
      data: createUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.userSignin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await userModels.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email Not Found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ msg: "Incorrect password" });
    }

    // Update lastLogin when user signs in
    user.lastLogin = new Date();
    await user.save(); // Save the updated user document

    return res.status(200).json({
      message: "Signin successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        lastLogin: user.lastLogin,
      },
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "An error occurred, please try again later" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userModels.find({});
    res.status(200).send({
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.getDashboardCounts = async (req, res) => {
  try {
    const registeredUsersCount = await userModels.countDocuments();
    const productCount = await productsModel.countDocuments();
    const orderCount = await orderModel.countDocuments();

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const loggedInUsers = await userModels.find({
      lastLogin: { $gte: twentyFourHoursAgo },
    });

    const loggedInUsersCount = loggedInUsers.length;

    res.status(200).json({
      registeredUsersCount,
      productCount,
      orderCount,
      loggedInUsersCount,
      loggedInUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching combined counts",
    });
  }
};
