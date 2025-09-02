const express = require("express");
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} = require("../controllers/postController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../utils/upload");

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPostById);

router.use(protect);
router.post("/", upload.single("image"), createPost);
router.patch("/:id", upload.single("image"), updatePost);
router.delete("/:id", deletePost);

module.exports = router;
