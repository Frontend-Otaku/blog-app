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
