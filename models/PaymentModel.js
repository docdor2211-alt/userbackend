const mongoose =
  require("mongoose");

const paymentSchema =
  new mongoose.Schema(

    {

      // USER

      userId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

      },



      // APPOINTMENT

      appointmentId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Appointment",

      },



      // PAYMENT INFO

      razorpay_order_id: {

        type: String,

        required: true,

      },



      razorpay_payment_id: {

        type: String,

        required: true,

      },



      razorpay_signature: {

        type: String,

        required: true,

      },



      // AMOUNT

      amount: {

        type: Number,

        required: true,

      },



      // STATUS

      paymentStatus: {

        type: String,

        enum: [
          "paid",
          "failed",
        ],

        default: "paid",

      },

    },

    {

      timestamps: true,

    }

  );



module.exports =
  mongoose.model(
    "Payment",
    paymentSchema
  );