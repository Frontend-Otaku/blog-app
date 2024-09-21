const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
	createPost,
	getPublicPosts,
	getPostsBySubscriptions,
	updatePost,
	deletePost,
	getPost,
} = require("../controllers/postController");
const router = express.Router();

// Создание поста
router.post("/", authMiddleware, createPost);

// Получить публичные посты
router.get("/public", getPublicPosts);

// Получить посты по подпискам
router.get("/subscriptions", authMiddleware, getPostsBySubscriptions);

// Получение одного поста
router.get("/:postId", authMiddleware, getPost);

// Обновление поста
router.put("/:postId", authMiddleware, updatePost);

// Удаление поста
router.delete("/:postId", authMiddleware, deletePost);

module.exports = router;
