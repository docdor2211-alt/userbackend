

const express = require("express");
const router = express.Router();

const {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
  deleteAdmin,
} = require("../controllers/adminController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Public
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// Protected
router.get("/profile", protect, getAdminProfile);
router.put("/profile", protect, updateAdminProfile);

// Admin Only
router.delete("/:id", protect, adminOnly, deleteAdmin);

module.exports = router;