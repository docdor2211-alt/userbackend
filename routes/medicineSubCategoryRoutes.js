
const express = require("express");

const router = express.Router();


// ==========================================
// ✅ CONTROLLERS
// ==========================================
const {
  createMedicineSubCategory,
  getMedicineSubCategories,
  getByMedicineCategory,
  getMedicineSubCategoryById,
  updateMedicineSubCategory,
  deleteMedicineSubCategory
} = require(
  "../controllers/medicineSubCategoryController"
);



// ==========================================
// ✅ CREATE
// ==========================================
// POST
// /api/medicine-subcategories
// ==========================================
router.post(
  "/",
  createMedicineSubCategory
);



// ==========================================
// ✅ GET ALL
// ==========================================
// GET
// /api/medicine-subcategories
// ==========================================
router.get(
  "/",
  getMedicineSubCategories
);



// ==========================================
// ✅ GET BY MEDICINE CATEGORY
// ==========================================
// GET
// /api/medicine-subcategories/by-category/:id
// ==========================================
router.get(
  "/by-category/:id",
  getByMedicineCategory
);



// ==========================================
// ✅ GET SINGLE
// ==========================================
// GET
// /api/medicine-subcategories/:id
// ==========================================
router.get(
  "/:id",
  getMedicineSubCategoryById
);



// ==========================================
// ✅ UPDATE
// ==========================================
// PUT
// /api/medicine-subcategories/:id
// ==========================================
router.put(
  "/:id",
  updateMedicineSubCategory
);



// ==========================================
// ✅ DELETE
// ==========================================
// DELETE
// /api/medicine-subcategories/:id
// ==========================================
router.delete(
  "/:id",
  deleteMedicineSubCategory
);



// ==========================================
// ✅ EXPORT
// ==========================================
module.exports = router;

