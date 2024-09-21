const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
	title: { type: String, required: true },
	body: { type: String, required: true },
	author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	tags: [{ type: String }],
	isPublic: { type: Boolean, default: true },
	isHidden: { type: Boolean, default: false },
	createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
