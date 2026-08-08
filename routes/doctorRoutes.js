const express = require("express");

const router = express.Router();

const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
});



// ================= CONTROLLER =================

const doctorController = require(
  "../controllers/doctorController"
);



// =====================================================
// ================= GET ALL DOCTORS ===================
// =====================================================

router.get(
  "/",

  doctorController.getDoctors
);

// =====================================================
// ================= CREATE DOCTOR =====================
// =====================================================

router.post(
  "/",
  upload.single("image"),
  doctorController.createDoctor
);

// =====================================================
// ================= GET SINGLE DOCTOR =================
// =====================================================

router.get(
  "/:id",

  doctorController.getDoctorById
);



// =====================================================
// ================= UPDATE DOCTOR =====================
// =====================================================

router.put(
  "/:id",

  upload.single("image"),

  doctorController.updateDoctor
);



// =====================================================
// ================= DELETE DOCTOR =====================
// =====================================================

router.delete(
  "/:id",

  doctorController.deleteDoctor
);



// =====================================================
// ================= APPROVE DOCTOR ====================
// =====================================================

router.put(
  "/approve/:id",

  doctorController.approveDoctor
);



// =====================================================
// ================= BLOCK DOCTOR ======================
// =====================================================

router.put(
  "/block/:id",

  doctorController.blockDoctor
);



module.exports = router;