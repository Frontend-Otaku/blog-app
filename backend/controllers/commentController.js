const Comment = require("../models/Comment");
const Post = require("../models/Post");

// Добавление комментария
exports.addComment = async (req, res) => {
	const { content, postId } = req.body;

	try {
		// Создаем новый комментарий
		const newComment = new Comment({
			content,
			author: req.user.userId, // ID пользователя берется из токена
			post: postId,
		});

		// Сохраняем комментарий в базу данных
		await newComment.save();

		res.json({ msg: "Комментарий добавлен" });
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
};

// Получение комментариев к посту
exports.getComments = async (req, res) => {
	const { postId } = req.params;

	try {
		const comments = await Comment.find({ post: postId }).populate(
			"author",
			"username"
		);
		res.json(comments);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
};
