// routes/videoCallRoutes.js

const express =
  require("express");

const router =
  express.Router();



/* =========================
   🎮 CONTROLLER
========================= */

const controller =
  require(
    "../controllers/videoCallController"
  );



/* =========================
   🔒 MIDDLEWARE
========================= */

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);





/* =====================================================
   🎥 CREATE VIDEO CALL
===================================================== */

router.post(

  "/create",

  protect,

  controller.createVideoCall

);





/* =====================================================
   📞 GET ALL MY CALLS
===================================================== */

router.get(

  "/my-calls",

  protect,

  controller.getMyCalls

);





/* =====================================================
   ⏳ GET UPCOMING CALLS
===================================================== */

router.get(

  "/upcoming",

  protect,

  controller.getUpcomingCalls

);





/* =====================================================
   📜 GET HISTORY CALLS
===================================================== */

router.get(

  "/history",

  protect,

  controller.getHistoryCalls

);





/* =====================================================
   🎥 JOIN VIDEO CALL
===================================================== */

router.get(

  "/join/:id",

  protect,

  controller.joinVideoCall

);





/* =====================================================
   ✅ COMPLETE VIDEO CALL
===================================================== */

router.put(

  "/complete/:id",

  protect,

  controller.completeCall

);





/* =====================================================
   ❌ CANCEL VIDEO CALL
===================================================== */

router.put(

  "/cancel/:id",

  protect,

  controller.cancelVideoCall

);





module.exports =
  router;