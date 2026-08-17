const express = require("express");
const router = express.Router();

const {
    getSettings,
    updateSettings,
} = require("../controllers/Settingcontroller");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// PUBLIC — koi bhi settings dekh sakta hai
// (jaise referral bonus amount frontend pe dikhane ke liye)
router.get("/", getSettings);

// ADMIN ONLY — sirf admin change kar sakta hai
router.put("/", protect, adminOnly, updateSettings);

module.exports = router;
