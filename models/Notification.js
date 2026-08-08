const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    body: {
      type: String,
      required: true,
      trim: true,
    },

    token: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      default: "general",
    },

    data: {
      type: Object,
      default: {},
    },

    firebaseMessageId: {
      type: String,
      default: "",
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["sent", "failed"],
      default: "sent",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Notification", notificationSchema);