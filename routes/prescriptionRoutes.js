// routes/prescriptionRoutes.js

const express =
  require("express");

const router =
  express.Router();

const {

  getMyPrescriptions,

  getSinglePrescription,

} = require(
  "../controllers/prescriptionController"
);

const {

  protect,

} = require(
  "../middleware/authMiddleware"
);



// GET MY PRESCRIPTIONS

router.get(
  "/my",
  protect,
  getMyPrescriptions
);



// // GET SINGLE PRESCRIPTION

// router.get(
//   "/:id",
//   protect,
//   getSinglePrescription
// );

module.exports =
  router;