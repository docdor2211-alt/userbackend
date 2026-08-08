// routes/healthPackageCategoryRoutes.js

const express = require("express");

const router = express.Router();

const {
  createHealthPackageCategory,
  getHealthPackageCategories,
  getHealthPackageCategoryById,
  updateHealthPackageCategory,
  deleteHealthPackageCategory,
} = require(
  "../controllers/healthPackageCategoryController"
);



// ================= CREATE CATEGORY =================

router.post(
  "/create",
  createHealthPackageCategory
);



// ================= GET ALL CATEGORIES =================

router.get(
  "/all",
  getHealthPackageCategories
);



// ================= GET SINGLE CATEGORY =================

router.get(
  "/:id",
  getHealthPackageCategoryById
);



// ================= UPDATE CATEGORY =================

router.put(
  "/update/:id",
  updateHealthPackageCategory
);



// ================= DELETE CATEGORY =================

router.delete(
  "/delete/:id",
  deleteHealthPackageCategory
);

module.exports = router;