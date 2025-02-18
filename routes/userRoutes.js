const express = require("express");
const userContrroller = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.get("/", userContrroller.getAllUsers);
router.post("/signup", authController.signup);

module.exports = router;
