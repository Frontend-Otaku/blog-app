const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Подключение маршрутов
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);

// Подключение к MongoDB
mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		console.log("MongoDB connect!");
		app.listen(PORT, () => {
			console.log(`Server running on post: ${PORT}`);
		});
	})
	.catch(err => {
		console.error(err.message);
	});
