const express = require("express");

const router = express.Router();

const {
  getMyOrders,
  getSingleOrder,
} = require("../controllers/userOrderController");

const {
  protect,
} = require("../middleware/authMiddleware");

router.get(
  "/my-orders",
  protect,
  getMyOrders
);

router.get(
  "/:id",
  protect,
  getSingleOrder
);

module.exports = router;