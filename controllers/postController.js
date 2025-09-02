const Post = require("../models/Post");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/posts");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

const createPost = [
  upload.single("image"),
  async (req, res) => {
    const { title, content } = req.body;
    const authorId = req.user._id;

    try {
      const post = await Post.create({
        title,
        content,
        authorId,
        image: req.file ? `/uploads/posts/${req.file.filename}` : "",
      });
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },
];

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("authorId", "name email");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "authorId",
      "name email"
    );
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const updatePost = [
  upload.single("image"),
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      if (
        post.authorId.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const updatedData = {
        title: req.body.title || post.title,
        content: req.body.content || post.content,
      };

      if (req.file) {
        updatedData.image = `/uploads/posts/${req.file.filename}`;
      }

      const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        updatedData,
        { new: true }
      );

      res.json(updatedPost);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },
];

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (
      post.authorId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createPost, getPosts, getPostById, updatePost, deletePost };
