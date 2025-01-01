const express = require("express");
const router = express.Router();
const controller = require("../Controllers/user.controller");
const auth = require("../Middleware/authMiddleware");

router.post("/user-signup", controller.Signup);
router.post("/user-signin", controller.userSignin);
router.get("/get-all-users", controller.getAllUsers);
router.get("/get-all-count", controller.getDashboardCounts);
module.exports = router;
