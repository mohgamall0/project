const express = require("express");

const { protect } = require("../middleware/auth");
const restrictTo = require("../middleware/restrictTo");

const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

const adminOnly = restrictTo("admin");

router.route("/").get(protect, adminOnly, getUsers);
router
  .route("/:id")
  .get(protect, getUserById)
  .put(protect, updateUser)
  .delete(protect, adminOnly, deleteUser);

module.exports = router;
