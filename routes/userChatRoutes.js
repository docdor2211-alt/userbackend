// routes/userChatRoutes.js

const express =
  require("express");

const router =
  express.Router();







const controller =
  require(
    "../controllers/userChatController"
  );





/* =========================
   🔐 MIDDLEWARE
========================= */

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);





/* =====================================================
   💬 START CHAT
===================================================== */

router.post(

  "/start",

  protect,

  controller.startChat

);





/* =====================================================
   📩 SEND MESSAGE
===================================================== */

router.post(

  "/send",

  protect,

  controller.sendMessage

);





/* =====================================================
   📨 GET ALL MESSAGES
===================================================== */

router.get(

  "/messages/:conversationId",

  protect,

  controller.getMessages

);





/* =====================================================
   💬 GET MY CHATS
===================================================== */

router.get(

  "/my-chats",

  protect,

  controller.getMyChats

);





/* =====================================================
   ❌ DELETE CHAT
===================================================== */

router.delete(

  "/delete/:id",

  protect,

  controller.deleteChat

);





module.exports =
  router;