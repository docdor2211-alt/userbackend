const express = require("express");
const router = express.Router();

const multer = require("multer");

// 🔥 multer config
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// 🔥 controller import
const {
  createSurgery,
  getSurgeries,
  getSurgeryById,
  updateSurgery,
  deleteSurgery
} = require("../controllers/surgeryController");


// =======================
// ✅ CREATE
// =======================
router.post(
  "/",
  upload.fields([{ name: "icon", maxCount: 1 }]),
  createSurgery
);


// =======================
// ✅ GET ALL
// =======================
router.get("/", getSurgeries);


// =======================
// ✅ GET ONE
// =======================
router.get("/:id", getSurgeryById);


// =======================
// ✅ UPDATE
// =======================
router.put(
  "/:id",
  upload.fields([{ name: "icon", maxCount: 1 }]),
  updateSurgery
);


// =======================
// ✅ DELETE
// =======================
router.delete("/:id", deleteSurgery);


module.exports = router;