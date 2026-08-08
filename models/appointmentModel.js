


const mongoose =
  require("mongoose");



const appointmentSchema =
  new mongoose.Schema(

    {

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



      // ✅ PATIENT DETAILS
      patientName: {
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

      reason: {
        type: String,
        default: "",
      },



      // ✅ TOKEN
      token: {
        type: Number,
        default: 0,
      },



      // ✅ DATE & TIME
      date: {

        type: String,

        required: true,

      },

      time: {

        type: String,

        required: true,

      },



      // ✅ TYPE
      type: {

        type: String,

        enum: [
          "online",
          "in-person",
        ],

        required: true,

      },



      // ✅ LOCATION
      latitude: {
        type: Number,
        default: 0,
      },

      longitude: {
        type: Number,
        default: 0,
      },



      // ✅ VITALS
      bloodPressure: {

        type: String,

        default: "",

      },

      weight: {

        type: String,

        default: "",

      },

      temperature: {

        type: String,

        default: "",

      },



      // ✅ STATUS
      status: {

        type: String,

  enum: [

  "pending",

  "approved",

  "completed",

  "cancelled",

],

default: "pending",

      },
      // ✅ PAYMENT
paymentMethod: {

  type: String,

  default: "ONLINE",
},

paymentStatus: {

  type: String,

  enum: [
    "PENDING",
    "PAID",
    "FAILED",
  ],

  default: "PENDING",
},

settlementStatus: {

  type: String,

  enum: [
    "PENDING",
    "SETTLED",
  ],

  default: "PENDING",
},

appointmentFees: {

  type: Number,

  default: 0,
},

adminCommission: {

  type: Number,

  default: 0,
},

doctorAmount: {

  type: Number,

  default: 0,
},


// ✅ RAZORPAY
razorpayOrderId: {

  type: String,

  default: "",
},

razorpayPaymentId: {

  type: String,

  default: "",
},

razorpaySignature: {

  type: String,

  default: "",
},

paidAt: {

  type: Date,
},

    },

    {

      timestamps: true,

    }

  );





module.exports =

  mongoose.models.Appointment ||

  mongoose.model(
    "Appointment",
    appointmentSchema
  );