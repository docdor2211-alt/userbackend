
// // routes/medicineCategoryRoutes.js

// const express = require("express");

// const router = express.Router();

// const {

//   createMedicineCategory,

//   getMedicineCategories,

//   getMedicineCategoriesByCategory,

//   getSingleMedicineCategory,

//   updateMedicineCategory,

//   deleteMedicineCategory,

//   toggleMedicineCategoryStatus,

// } = require(
//   "../controllers/medicineCategoryController"
// );

// // ==========================================
// // ✅ CREATE
// // ==========================================
// router.post(
//   "/",
//   createMedicineCategory
// );

// // ==========================================
// // ✅ GET ALL
// // ==========================================
// router.get(
//   "/",
//   getMedicineCategories
// );

// // ==========================================
// // ✅ GET CATEGORY WISE
// // ==========================================
// router.get(
//   "/category/:categoryId",
//   getMedicineCategoriesByCategory
// );

// // ==========================================
// // ✅ GET SINGLE
// // ==========================================
// router.get(
//   "/:id",
//   getSingleMedicineCategory
// );

// // ==========================================
// // ✅ UPDATE
// // ==========================================
// router.put(
//   "/:id",
//   updateMedicineCategory
// );

// // ==========================================
// // ✅ DELETE
// // ==========================================
// router.delete(
//   "/:id",
//   deleteMedicineCategory
// );

// // ==========================================
// // ✅ TOGGLE STATUS
// // ==========================================
// router.patch(
//   "/toggle/:id",
//   toggleMedicineCategoryStatus
// );

// module.exports = router;


const express = require("express");

const router = express.Router();


// ==========================================
// ✅ CONTROLLERS
// ==========================================
const {
  createMedicineCategory,
  getMedicineCategories,
  getByCategory,
  getMedicineCategoryById,
  updateMedicineCategory,
  deleteMedicineCategory
} = require(
  "../controllers/medicineCategoryController"
);



// ==========================================
// ✅ CREATE
// ==========================================
// POST
// /api/medicine-categories
// ==========================================
router.post(
  "/",
  createMedicineCategory
);



// ==========================================
// ✅ GET ALL
// ==========================================
// GET
// /api/medicine-categories
// ==========================================
router.get(
  "/",
  getMedicineCategories
);



// ==========================================
// ✅ GET BY MAIN CATEGORY
// ==========================================
// GET
// /api/medicine-categories/by-category/:id
// ==========================================
router.get(
  "/by-category/:id",
  getByCategory
);



// ==========================================
// ✅ GET SINGLE
// ==========================================
// GET
// /api/medicine-categories/:id
// ==========================================
router.get(
  "/:id",
  getMedicineCategoryById
);



// ==========================================
// ✅ UPDATE
// ==========================================
// PUT
// /api/medicine-categories/:id
// ==========================================
router.put(
  "/:id",
  updateMedicineCategory
);



// ==========================================
// ✅ DELETE
// ==========================================
// DELETE
// /api/medicine-categories/:id
// ==========================================
router.delete(
  "/:id",
  deleteMedicineCategory
);



// ==========================================
// ✅ EXPORT
// ==========================================
module.exports = router;

