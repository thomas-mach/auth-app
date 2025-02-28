const express = require("express");
const authController = require("../controllers/authController");
const limiter = require("express-rate-limit");

const router = express.Router();

const authLimiter = limiter({
  windowsMs: 5 * 60 * 1000,
  max: 100,
  headers: true,
  handler: (req, res) => {
    res.status(429).json({
      error: "Troppi tentativi! Riprova tra qualche minuto.",
    });
  },
  message: "Trope richieste riprova piu tardi",
});

router.post("/signup", authLimiter, authController.signup);
router.get("/verify", authController.verifyEmail);
router.post("/login", authLimiter, authController.login);
router.post("/logout", authController.logout);
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
