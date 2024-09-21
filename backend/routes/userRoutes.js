const express = require("express");
const router = express.Router();
const {
	register,
	login,
	subscribeToUser,
	unsubscribeFromUser,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Подписка на пользователя
router.post("/subscribe", authMiddleware, subscribeToUser);

// Отписка от пользователя
router.post("/unsubscribe", authMiddleware, unsubscribeFromUser);

module.exports = router;
