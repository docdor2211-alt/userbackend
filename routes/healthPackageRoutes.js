// routes/healthPackageRoutes.js

const express = require("express");

const router = express.Router();

const {
  createHealthPackage,
  getHealthPackages,
  getHealthPackageById,
  updateHealthPackage,
  deleteHealthPackage,
} = require(
  "../controllers/healthPackageController"
);



// ================= CREATE HEALTH PACKAGE =================

router.post(
  "/create",
  createHealthPackage
);



// ================= GET ALL HEALTH PACKAGES =================

router.get(
  "/all",
  getHealthPackages
);



// ================= GET SINGLE HEALTH PACKAGE =================

router.get(
  "/:id",
  getHealthPackageById
);



// ================= UPDATE HEALTH PACKAGE =================

router.put(
  "/update/:id",
  updateHealthPackage
);



// ================= DELETE HEALTH PACKAGE =================

router.delete(
  "/delete/:id",
  deleteHealthPackage
);

module.exports = router;