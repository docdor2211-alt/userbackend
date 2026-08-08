
const mongoose =
  require("mongoose");

const paymentSettlementSchema =
  new mongoose.Schema(

    {

      // ==========================================
      // USER
      // ==========================================

      userId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,
      },



      // ==========================================
      // RECEIVER
      // ==========================================

      receiverId: {

        type:
          mongoose.Schema.Types.ObjectId,

        required: true,
      },



      receiverType: {

        type: String,

        enum: [

          "DOCTOR",

          "LAB",

          "MEDICINE",

        ],

        required: true,
      },



      // ==========================================
      // SOURCE
      // ==========================================

      sourceType: {

        type: String,

        enum: [

          "APPOINTMENT",

          "LAB_BOOKING",

          "MEDICINE_ORDER",

        ],

        required: true,
      },



      sourceId: {

        type:
          mongoose.Schema.Types.ObjectId,

        required: true,
      },



      // ==========================================
      // PAYMENT
      // ==========================================

      totalAmount: {

        type: Number,

        required: true,
      },



      adminCommission: {

        type: Number,

        default: 0,
      },



      receiverAmount: {

        type: Number,

        default: 0,
      },



      // ==========================================
      // STATUS
      // ==========================================

      settlementStatus: {

        type: String,

        enum: [

          "PENDING",

          "SETTLED",

        ],

        default: "PENDING",
      },



      // ==========================================
      // RAZORPAY
      // ==========================================

      razorpayOrderId: {

        type: String,

        default: "",
      },



      razorpayPaymentId: {

        type: String,

        default: "",
      },



      // ==========================================
      // DATE
      // ==========================================

      settledAt: {

        type: Date,
      },

    },

    {

      timestamps: true,
    }

  );

module.exports =
  mongoose.model(

    "PaymentSettlement",

    paymentSettlementSchema

  );

