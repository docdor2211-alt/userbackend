// routes/labBookingRoutes.js

const express = require("express");

const router = express.Router();

const {

  createLabBooking,

  verifyLabPayment,

  getMyLabBookings,

  getAllLabBookings,

} = require(
  "../controllers/labBookingController"
);


const {

  protect,

  userOnly,

  adminOnly,

} = require(
  "../middleware/authMiddleware"
);



// ==========================================
// USER
// ==========================================


// CREATE BOOKING
router.post(
  "/create",
  protect,
  userOnly,
  createLabBooking
);


// VERIFY PAYMENT
router.post(
  "/verify-payment",
  protect,
  userOnly,
  verifyLabPayment
);


// MY BOOKINGS
router.get(
  "/my-bookings",
  protect,
  userOnly,
  getMyLabBookings
);



// ==========================================
// ADMIN
// ==========================================


// ALL BOOKINGS
router.get(
  "/all",
  protect,
  adminOnly,
  getAllLabBookings
);



module.exports = router;