const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  createLabCategory,
  getLabCategories,
  getLabCategoryById,
  updateLabCategory,
  deleteLabCategory,
} = require("../controllers/labCategoryController");

// CREATE
router.post(
  "/",
  upload.fields([{ name: "image", maxCount: 1 }]),
  createLabCategory
);

// GET ALL
router.get("/", getLabCategories);

// GET ONE
router.get("/:id", getLabCategoryById);

// UPDATE
router.put(
  "/:id",
  upload.fields([{ name: "image", maxCount: 1 }]),
  updateLabCategory
);

// DELETE
router.delete("/:id", deleteLabCategory);

module.exports = router;