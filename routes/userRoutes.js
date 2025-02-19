const express = require("express");
const userContrroller = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.get("/", userContrroller.getAllUsers);
router.post("/signup", authController.signup);
router.get("/auth", authController.verifyEmail);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/deleteMe", authController.protect, authController.softDeleteUser);

module.exports = router;
