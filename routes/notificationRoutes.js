const express = require("express");

const router = express.Router();

const {
  sendNotification,
  getNotifications,
  getNotificationById,
  getUserNotifications,
  markAsRead,
  deleteNotification,
  deleteAllNotifications,
} = require("../controllers/notificationController");

/*
==========================================
SEND
==========================================
*/
router.post("/send-notification", sendNotification);

/*
==========================================
GET ALL
==========================================
*/
router.get("/", getNotifications);

/*
==========================================
GET USER NOTIFICATIONS
==========================================
*/
router.get("/user/:userId", getUserNotifications);

/*
==========================================
GET SINGLE
==========================================
*/
router.get("/:id", getNotificationById);

/*
==========================================
MARK READ
==========================================
*/
router.put("/mark-read/:id", markAsRead);

/*
==========================================
DELETE SINGLE
==========================================
*/
router.delete("/:id", deleteNotification);

/*
==========================================
DELETE ALL
==========================================
*/
router.delete("/delete/all", deleteAllNotifications);

module.exports = router;