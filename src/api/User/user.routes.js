

const express = require("express");
const router = express.Router();
const userController = require("./user.controller");


router.get("/test", (req, res) => {
  res.json({ message: "Auth routes working" });
});

// Register route
router.post("/register", userController.registerUser);

// Login route
router.post("/login", userController.loginUser);

// Refresh token route
router.post("/refresh", userController.refreshToken);



module.exports = router;
