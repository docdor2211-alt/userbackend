const mongoose =
  require("mongoose");



const videoCallSchema =
  new mongoose.Schema({

    // ✅ APPOINTMENT
    appointmentId: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: "Appointment",

      required: true,

    },



    // ✅ DOCTOR
    doctorId: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: "Doctor",

      required: true,

    },



    // ✅ USER
    userId: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,

    },



    // ✅ ROOM ID
    roomId: {

      type: String,

      required: true,

    },



    // ✅ STATUS
    callStatus: {

      type: String,

      enum: [

        "waiting",

        "ongoing",

        "completed",

        "missed",

        "cancelled",

      ],

      default: "waiting",

    },



    // ✅ CALL TIME
    startedAt: {

      type: Date,

      default: null,

    },



    endedAt: {

      type: Date,

      default: null,

    },



    // ✅ CALL DURATION
    duration: {

      type: Number,

      default: 0,

    },



    // ===================================================
    // ✅ UPCOMING CONSULTATION DATA
    // ===================================================

    appointmentDate: {

      type: String,

      default: "",

    },



    appointmentTime: {

      type: String,

      default: "",

    },



    patientName: {

      type: String,

      default: "",

    },



    issue: {

      type: String,

      default: "",

    },



    age: {

      type: Number,

      default: 0,

    },



    gender: {

      type: String,

      default: "",

    },



    weight: {

      type: String,

      default: "",

    },



    prescription: {

      type: String,

      default: "",

    },



    isCompleted: {

      type: Boolean,

      default: false,

    },



    // ===================================================
    // ✅ OPTIONAL FEATURES
    // ===================================================

    notes: {

      type: String,

      default: "",

    },



    cancelledBy: {

      type: String,

      enum: [
        "doctor",
        "user",
        "",
      ],

      default: "",

    },



    cancelReason: {

      type: String,

      default: "",

    },

  },

  {
    timestamps: true,
  }
);





module.exports =
  mongoose.model(
    "VideoCall",
    videoCallSchema
  );