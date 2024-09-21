const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
	const { username, email, password } = req.body;

	try {
		const user = await User.find({ email });
		if (user.length !== 0)
			return res.status(400).json({ msg: "Пользователь уже существует" });

		const userDoc = new User({ username, email, password });
		userDoc.save();

		const payload = { userId: userDoc._id };
		const token = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});

		res.json({ token });
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
};

exports.login = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch)
			return res.status(400).json({ msg: "Неверные учетные данные" });

		const payload = { userId: user._id };
		const token = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});

		res.json({ token });
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
};

exports.subscribeToUser = async (req, res) => {
	try {
		const { targetUserId } = req.body;

		const targetUser = await User.findById(targetUserId);
		if (!targetUser) {
			return res.status(404).json({ msg: "Пользователь не найден" });
		}

		const user = await User.findById(req.user.userId);

		if (user.subscriptions.includes(targetUserId)) {
			return res
				.status(400)
				.json({ msg: "Вы уже подписаны на этого пользователя" });
		}

		user.subscriptions.push(targetUserId);
		await user.save();

		res.json({
			msg: `Вы подписались на пользователя ${targetUser.username}`,
		});
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
};

// Отписка от пользователя
exports.unsubscribeFromUser = async (req, res) => {
	try {
		const { targetUserId } = req.body;

		const user = await User.findById(req.user.userId);

		// Если поле subscriptions не определено, инициализируем его как пустой массив
		if (!user.subscriptions) {
			user.subscriptions = [];
		}

		if (!user.subscriptions.includes(targetUserId)) {
			return res
				.status(400)
				.json({ msg: "Вы не подписаны на этого пользователя" });
		}

		user.subscriptions = user.subscriptions.filter(
			id => id.toString() !== targetUserId
		);
		await user.save();

		res.json({ msg: `Вы отписались от пользователя ${targetUserId}` });
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
};
