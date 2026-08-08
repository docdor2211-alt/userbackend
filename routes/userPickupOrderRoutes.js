const express =
  require("express");

const router =
  express.Router();

// CONTROLLERS
const {

  createUserPickupOrder,

  getUserOrders,

  getSingleUserOrder,

  cancelUserOrder,

} = require(
  "../controllers/userPickupOrderController"
);

// MIDDLEWARE
const {

  protect,

  userOnly,

} = require(
  "../middleware/authMiddleware"
);

// ==========================================
// CREATE ORDER
// ==========================================

router.post(
  "/create",

  protect,

  userOnly,

  createUserPickupOrder
);

// ==========================================
// GET MY ORDERS
// ==========================================

router.get(
  "/my-orders",

  protect,

  userOnly,

  getUserOrders
);

// ==========================================
// GET SINGLE ORDER
// ==========================================

router.get(
  "/:id",

  protect,

  userOnly,

  getSingleUserOrder
);

// ==========================================
// CANCEL ORDER
// ==========================================

router.put(
  "/cancel/:id",

  protect,

  userOnly,

  cancelUserOrder
);

module.exports =
  router;