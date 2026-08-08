// // // routes/medicineOrderRoutes.js

// // const express = require("express");

// // const router = express.Router();

// // const {
// //   createMedicineOrder,
// //   verifyMedicinePayment,
// //   getAllMedicineOrders,
// //   getSingleMedicineOrder,
// // } = require("../controllers/medicineOrderController");

// // router.post(
// //   "/create",
// //    protect,
// //   userOnly,
// //   createMedicineOrder
// // );

// // router.post(
// //   "/verify-payment",
// //   verifyMedicinePayment
// // );

// // router.get(
// //   "/all",
// //   getAllMedicineOrders
// // );

// // router.get(
// //   "/:id",
// //   getSingleMedicineOrder
// // );

// // module.exports = router;


// // routes/medicineOrderRoutes.js

// const express = require("express");

// const router = express.Router();

// const {

//   createMedicineOrder,

//   verifyMedicinePayment,

//   getAllMedicineOrders,

//   getSingleMedicineOrder,
//   getMyMedicineOrders,

// } = require("../controllers/medicineOrderController");


// // =========================
// // AUTH MIDDLEWARE
// // =========================

// const {

//   protect,

//   adminOnly,

//   userOnly,

// } = require("../middleware/authMiddleware");



// // ======================================================
// // 👤 USER ROUTES
// // ======================================================


// // ✅ CREATE ORDER
// router.post(
//   "/create",
//   protect,
//   userOnly,
//   createMedicineOrder
// );


// // ✅ VERIFY PAYMENT
// router.post(
//   "/verify-payment",
//   protect,
//   userOnly,
//   verifyMedicinePayment
// );
// // ✅ GET ALL ORDERS
// router.get(
//   "/all",
//   protect,
//   adminOnly,
//   getAllMedicineOrders
// );
// // ✅ GET MY ORDERS
// router.get(
//   "/my-orders",
//   protect,
//   userOnly,
//   getMyMedicineOrders
// );

// // ✅ GET SINGLE ORDER
// router.get(
//   "/:id",
//   protect,
//   getSingleMedicineOrder
// );



// // ======================================================
// // 👑 ADMIN ROUTES
// // ======================================================


// // ✅ GET ALL ORDERS
// // router.get(
// //   "/all",
// //   protect,
// //   adminOnly,
// //   getAllMedicineOrders
// // );



// // ======================================================
// // EXPORT
// // ======================================================

// module.exports = router;



// routes/medicineOrderRoutes.js

const express =
  require("express");

const router =
  express.Router();

// ==========================================
// CONTROLLERS
// ==========================================

const {

  createMedicineOrder,

  verifyMedicinePayment,

  getAllMedicineOrders,

  getSingleMedicineOrder,

  getMyMedicineOrders,

  updateMedicineOrderStatus,

} = require(
  "../controllers/medicineOrderController"
);

// ==========================================
// AUTH MIDDLEWARE
// ==========================================

const {

  protect,

  adminOnly,

  userOnly,

} = require(
  "../middleware/authMiddleware"
);


// ======================================================
// 👤 USER ROUTES
// ======================================================


// ==========================================
// CREATE ORDER
// ==========================================

router.post(
  "/create",

  protect,

  userOnly,

  createMedicineOrder
);


// ==========================================
// VERIFY PAYMENT
// ==========================================

router.post(
  "/verify-payment",

  protect,

  userOnly,

  verifyMedicinePayment
);


// ==========================================
// GET MY ORDERS
// ==========================================

router.get(
  "/my-orders",

  protect,

  userOnly,

  getMyMedicineOrders
);
// ==========================================
// GET ALL ORDERS
// ==========================================

router.get(
  "/all",

  protect,

  adminOnly,

  getAllMedicineOrders
);


// ==========================================
// GET SINGLE ORDER
// ==========================================

router.get(
  "/:id",

  protect,

  getSingleMedicineOrder
);


// ======================================================
// 👑 ADMIN ROUTES
// ======================================================




// ==========================================
// UPDATE ORDER STATUS
// ==========================================

router.put(
  "/update-status/:id",

  protect,

  adminOnly,

  updateMedicineOrderStatus
);


// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports =
  router;