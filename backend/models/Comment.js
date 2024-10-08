const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
	content: { type: String, required: true },
	author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
	createdAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
