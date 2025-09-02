const express = require("express");
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { protect, restrictTo } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", restrictTo("admin"), getUsers);
router.post("/", restrictTo("admin"), createUser);
router.get("/:id", getUserById);
router.patch("/:id", restrictTo("admin"), updateUser);
router.delete("/:id", restrictTo("admin"), deleteUser);

module.exports = router;
