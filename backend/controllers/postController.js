const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");

// Создание нового поста
exports.createPost = async (req, res) => {
	const { title, body, tags, isPublic, isHidden } = req.body;

	try {
		const post = new Post({
			title,
			body,
			author: req.user.userId,
			tags,
			isPublic,
			isHidden,
		});

		await post.save();
		res.status(201).json(post);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
};

// Получение одного поста
exports.getPost = async (req, res) => {
	const { postId } = req.params;

	try {
		const post = await Post.findById(postId).populate("author", "username");

		if (post.isHidden && post.author.toString() !== req.user.userId) {
			return res.status(403).json({ msg: "Доступ к этому посту запрещен" });
		}

		// Получаем комментарии к посту
		const comments = await Comment.find({ post: postId }).populate(
			"author",
			"username"
		);

		// Возвращаем пост и его комментарии
		res.json({ post, comments });
	} catch (err) {
		console.log(err.message);
		res.status(500).json("Server error");
	}
};

// Получение публичных постов
exports.getPublicPosts = async (req, res) => {
	try {
		const posts = await Post.find({ isPublic: true }).populate(
			"author",
			"username"
		);
		res.json(posts);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
};

// Получение постов по подписке
exports.getPostsBySubscriptions = async (req, res) => {
	try {
		const user = await User.findById(req.user.userId).populate("subscriptions");
		const posts = await Post.find({
			author: { $in: user.subscriptions },
			isPublic: true,
		});

		res.json(posts);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
};

// Обновление поста
exports.updatePost = async (req, res) => {
	const { postId } = req.params;
	const { title, body, tags, isPublic, isHidden } = req.body;

	try {
		const post = await Post.findById(postId);

		post.title = title || post.title;
		post.body = body || post.body;
		post.tags = tags || post.tags;
		post.isPublic = isPublic !== undefined ? isPublic : post.isPublic;
		post.isHidden = isHidden !== undefined ? isHidden : post.isHidden;

		await post.save();

		res.json(post);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
};

// Удаление поста
exports.deletePost = async (req, res) => {
	const { postId } = req.params;

	try {
		const post = Post.findById(postId);

		if (!post) return res.status(404).json({ msg: "Пост не найден" });

		await Post.findByIdAndDelete(postId);
		res.json({ msg: "Пост удален" });
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
};
