const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"] },
    content: {
      type: String,
      unique: true,
      required: [true, "Content is required"],
    },
    autherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
