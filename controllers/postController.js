const Post = require("../models/Post");

exports.createPost = async (req, res, next) => {
  try {
    const post = await Post.create({
      ...req.body,
      autherId: req.user._id,
      image: req.file?.filename,
    });
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().populate("autherId", "name email");
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

exports.getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "autherId",
      "name email"
    );
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (req.file) updates.image = req.file.filename;

    // Only allow owner or admin to update
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (
      req.user.role !== "admin" &&
      String(post.autherId) !== String(req.user._id)
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    Object.assign(post, updates);
    await post.save();
    res.json(post);
  } catch (err) {
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (
      req.user.role !== "admin" &&
      String(post.autherId) !== String(req.user._id)
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted" });
  } catch (err) {
    next(err);
  }
};
