const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
});

const {
  createSymptomCategory,
  getSymptomCategories,
  getSymptomCategoryById,
  updateSymptomCategory,
  deleteSymptomCategory,
} = require("../controllers/symptomCategoryController");

router.post(
  "/",
  upload.fields([{ name: "image", maxCount: 1 }]),
  createSymptomCategory,
);

router.get("/", getSymptomCategories);

router.get("/:id", getSymptomCategoryById);

router.put(
  "/:id",
  upload.fields([{ name: "image", maxCount: 1 }]),
  updateSymptomCategory,
);

router.delete("/:id", deleteSymptomCategory);

module.exports = router;