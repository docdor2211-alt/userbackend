


const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
} = require("../controllers/categoryController");

const multer = require("multer");

// ==========================================
// 🔥 AUTO CREATE UPLOAD FOLDER IF NOT EXISTS
// ==========================================
const uploadDir = path.join(__dirname, "..", "uploads", "categories");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ==========================================
// 🔥 MULTER CONFIG
// ==========================================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `cat-${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, WEBP images are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// ==========================================
// 🔥 MULTER ERROR HANDLER MIDDLEWARE
// ==========================================
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ success: false, message: "File too large. Max 5MB allowed." });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({ success: false, message: `Unexpected field: "${err.field}". Use field name "image".` });
    }
    return res.status(400).json({ success: false, message: err.message });
  }
  if (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next();
};

// ==========================================
// 🔥 ROUTES
// ==========================================

// ✅ CREATE CATEGORY
router.post(
  "/",
  (req, res, next) => upload.single("image")(req, res, (err) => handleMulterError(err, req, res, next)),
  createCategory
);

// ✅ GET ALL CATEGORIES
router.get("/", getCategories);

// ✅ GET SINGLE CATEGORY
router.get("/:id", getCategoryById);

// ✅ UPDATE CATEGORY
router.put(
  "/:id",
  (req, res, next) => upload.single("image")(req, res, (err) => handleMulterError(err, req, res, next)),
  updateCategory
);

// ✅ DELETE CATEGORY
router.delete("/:id", deleteCategory);

// ✅ TOGGLE ACTIVE/INACTIVE
router.patch("/toggle/:id", toggleCategoryStatus);

module.exports = router;