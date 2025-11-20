const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.get("/me", authController.me);

// GOOGLE LOGIN
router.get("/google", authController.googleLogin);
router.get("/google/callback", authController.googleCallback);

module.exports = router;
