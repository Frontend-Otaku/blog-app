const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { addComment, getComments } = require("../controllers/commentController");
const router = express.Router();

// Добавление комментария
router.post("/", authMiddleware, addComment);

// Получить комментарии к посту
router.get("/:postId", getComments);

module.exports = router;
