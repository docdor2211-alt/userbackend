

const express =
  require("express");

const router =
  express.Router();

const {

  createOrder,

  verifyPayment,

  getMyPayments,

  getAllPayments,
  settleDoctorPayment,

} = require(
  "../controllers/paymentController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);



// CREATE ORDER

router.post(
  "/create-order",
  protect,
  createOrder
);



// VERIFY PAYMENT

router.post(
  "/verify-payment",
  protect,
  verifyPayment
);






// USER PAYMENTS

router.get(
  "/my-payments",
  protect,
  getMyPayments
);



// ADMIN PAYMENTS

router.get(
  "/all-payments",
  protect,
  getAllPayments
);
// ADMIN SETTLE DOCTOR PAYMENT

router.put(

  "/settle-doctor-payment",

  protect,

  settleDoctorPayment
);

module.exports =
  router;