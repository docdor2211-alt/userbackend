// const express = require("express");
// const router = express.Router();

// const multer = require("multer");

// // ✅ multer setup (memory for cloud upload)
// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 5 * 1024 * 1024 } // 5MB
// });

// // ✅ controller import
// const {
//   createMedicine,
//   getMedicines,
//   getBySubCategory,
//   getMedicineById,
//   updateMedicine,
//   deleteMedicine
// } = require("../controllers/medicineItemController");


// // ================= ROUTES =================

// // ✅ CREATE
// router.post(
//   "/",
//   upload.fields([{ name: "image", maxCount: 1 }]),
//   createMedicine
// );

// // ✅ GET ALL (search + pagination + filter)
// router.get("/", getMedicines);

// // ✅ GET BY SUBCATEGORY (🔥 MAIN FOR YOUR UI)
// router.get("/by-subcategory/:id", getBySubCategory);

// // ✅ GET SINGLE
// router.get("/:id", getMedicineById);

// // ✅ UPDATE
// router.put(
//   "/:id",
//   upload.fields([{ name: "image", maxCount: 1 }]),
//   updateMedicine
// );

// // ✅ DELETE
// router.delete("/:id", deleteMedicine);


// module.exports = router;




const express = require("express");
const router = express.Router();

const multer = require("multer");


// ===========================================
// ✅ MULTER SETUP
// ===========================================
const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});


// ===========================================
// ✅ CONTROLLERS
// ===========================================
const {
  createMedicine,
  getMedicines,
  getBySubCategory,
  getMedicineById,
  updateMedicine,
  deleteMedicine
} = require(
  "../controllers/medicineItemController"
);



// ===========================================
// ✅ CREATE MEDICINE
// ===========================================
// POST /api/medicine-items
// ===========================================
router.post(
  "/",

  upload.fields([
    {
      name: "image",
      maxCount: 1
    }
  ]),

  createMedicine
);



// ===========================================
// ✅ GET ALL MEDICINES
// ===========================================
// GET /api/medicine-items
//
// Query:
// ?page=1
// ?limit=10
// ?search=dolo
// ?medicineCategory=ID
// ===========================================
router.get(
  "/",
  getMedicines
);



// ===========================================
// ✅ GET MEDICINES BY SUBCATEGORY
// ===========================================
// GET /api/medicine-items/by-subcategory/:id
// ===========================================
router.get(
  "/by-subcategory/:id",
  getBySubCategory
);



// ===========================================
// ✅ GET SINGLE MEDICINE
// ===========================================
// GET /api/medicine-items/:id
// ===========================================
router.get(
  "/:id",
  getMedicineById
);



// ===========================================
// ✅ UPDATE MEDICINE
// ===========================================
// PUT /api/medicine-items/:id
// ===========================================
router.put(
  "/:id",

  upload.fields([
    {
      name: "image",
      maxCount: 1
    }
  ]),

  updateMedicine
);



// ===========================================
// ✅ DELETE MEDICINE
// ===========================================
// DELETE /api/medicine-items/:id
// ===========================================
router.delete(
  "/:id",
  deleteMedicine
);



// ===========================================
// ✅ EXPORT
// ===========================================
module.exports = router;

