const express = require("express");
const router = express.Router();

const multer = require("multer");

// 🔹 Memory storage (tu already use kar raha hai)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 🔹 Controller import
const {
  createMedicine,
  getMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
} = require("../controllers/medicineController");

// ==============================
// 🔥 ROUTES
// ==============================

// ✅ CREATE (with image)
router.post(
  "/",
  upload.fields([{ name: "image", maxCount: 1 }]),
  createMedicine
);

// ✅ GET ALL
router.get("/", getMedicines);

// ✅ GET SINGLE
router.get("/:id", getMedicineById);

// ✅ UPDATE (with image optional)
router.put(
  "/:id",
  upload.fields([{ name: "image", maxCount: 1 }]),
  updateMedicine
);

// ✅ DELETE
router.delete("/:id", deleteMedicine);

module.exports = router;