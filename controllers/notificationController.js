const admin = require("../config/firebase");
const Notification = require("../models/Notification");

exports.sendNotification = async (req, res) => {
  try {
    const { userId, token, title, body, type, data } = req.body;

    let firebaseMessageId = "";
    let status = "failed";

    // Try sending FCM only if token exists
    if (token) {
      try {
        const message = {
          token,
          notification: {
            title: title || "Notification",
            body: body || "",
          },
          data:
            data && typeof data === "object"
              ? Object.fromEntries(
                  Object.entries(data).map(([k, v]) => [k, String(v)]),
                )
              : {},
          android: {
            priority: "high",
          },
        };

        firebaseMessageId = await admin.messaging().send(message);

        status = "sent";
      } catch (fcmError) {
        console.log("FCM ERROR =>", fcmError.message);

        status = "failed";
      }
    }

    // Save notification regardless of FCM success/failure
    const notification = await Notification.create({
      userId,
      token: token || "",
      title,
      body,
      type: type || "general",
      data: data || {},
      firebaseMessageId,
      status,
    });

    return res.status(200).json({
      success: true,
      message:
        status === "sent"
          ? "Notification sent successfully"
          : "Notification saved but FCM failed",
      notification,
    });
  } catch (error) {
    console.error("NOTIFICATION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
/*
==========================================
GET ALL NOTIFICATIONS
==========================================
*/
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
==========================================
GET SINGLE NOTIFICATION
==========================================
*/
exports.getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id).populate(
      "userId",
      "name email",
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
==========================================
GET USER NOTIFICATIONS
==========================================
*/
exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
==========================================
MARK AS READ
==========================================
*/
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      {
        isRead: true,
      },
      {
        new: true,
      },
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
==========================================
DELETE NOTIFICATION
==========================================
*/
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
==========================================
DELETE ALL NOTIFICATIONS
==========================================
*/
exports.deleteAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({});

    res.status(200).json({
      success: true,
      message: "All notifications deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};