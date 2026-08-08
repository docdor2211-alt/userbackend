// routes/petOrderRoutes.js

const express = require("express");

const router = express.Router();

const {

  createPetOrder,

  verifyPetPayment,

  getMyPetOrders,

  getAllPetOrders,

} = require(
  "../controllers/petOrderController"
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


// CREATE ORDER
router.post(
  "/create",
  protect,
  userOnly,
  createPetOrder
);


// VERIFY PAYMENT
router.post(
  "/verify-payment",
  protect,
  userOnly,
  verifyPetPayment
);


// MY ORDERS
router.get(
  "/my-orders",
  protect,
  userOnly,
  getMyPetOrders
);



// ==========================================
// ADMIN
// ==========================================


// ALL ORDERS
router.get(
  "/all",
  protect,
  adminOnly,
  getAllPetOrders
);



module.exports = router;