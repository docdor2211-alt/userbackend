const mongoose =
  require("mongoose");



const userChatConversationSchema =
  new mongoose.Schema({

    // ✅ APPOINTMENT
    appointmentId: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: "Appointment",

      required: true,

    },



    // ✅ USER
    userId: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,

    },



    // ✅ DOCTOR
    doctorId: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: "Doctor",

      required: true,

    },



    // ✅ LAST MESSAGE
    lastMessage: {

      type: String,

      default: "",

    },



    // ✅ LAST MESSAGE TIME
    lastMessageTime: {

      type: Date,

      default:
        Date.now,

    },



    // ✅ CHAT ACTIVE
    isActive: {

      type: Boolean,

      default: true,

    },



    // ✅ UNREAD COUNT
    unreadUserCount: {

      type: Number,

      default: 0,

    },



    unreadDoctorCount: {

      type: Number,

      default: 0,

    },

  },

  {
    timestamps: true,
  }
);





module.exports =
  mongoose.model(

    "UserChatConversation",

    userChatConversationSchema

  );