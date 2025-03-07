const express = require("express");
const authController = require("../controllers/authController");
const limiter = require("express-rate-limit");

const router = express.Router();

const authLimiter = limiter({
  windowsMs: 5 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 5 : 100,
  headers: true,
  handler: (req, res) => {
    res.status(429).json({
      status: "failed",
      message: "Too many attempts! Please try again in a few minutes.",
    });
  },
});

router.post("/signup", authController.signup);
router.get("/verify", authController.verifyEmail);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/resendEmail", authController.resendEmail);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);
router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updatePassword
);

module.exports = router;

// express rate limit - Evitare attacchi DDoS (Distributed Denial of Service)
// Proteggere API pubbliche dall’abuso
// Evitare lo spam di richieste da parte di bot o utenti malevoli
// Di default, express-rate-limit memorizza i dati in memoria RAM (quindi si azzera se il server si riavvia).
// Per scalare l'applicazione, puoi usare Redis o un database con rate-limit-redis:
