// models/petOrderModel.js

const mongoose = require("mongoose");


// ======================================================
// PET ORDER ITEM
// ======================================================

const petOrderItemSchema = new mongoose.Schema(

  {

    product: {

      type: mongoose.Schema.Types.ObjectId,

      ref: "PetProduct",

      required: true,

    },

    name: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    quantity: {
      type: Number,
      required: true,
      default: 1,
    },

    price: {
      type: Number,
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    weight: {
      type: String,
      default: "",
    },

    flavor: {
      type: String,
      default: "",
    },

  },

  { _id: false }

);



// ======================================================
// PET ORDER
// ======================================================

const petOrderSchema = new mongoose.Schema(

  {

    // USER
    user: {

      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,

    },
    // PHARMACY
pharmacyId: {

  type:
    mongoose.Schema.Types.ObjectId,

  ref: "PharmacyUser",

  required: true,

},
    


    // PET INFO
    petName: {

      type: String,

      required: true,

      trim: true,

    },

    petType: {

      type: String,

      required: true,

      trim: true,

    },


    // ITEMS
    items: [petOrderItemSchema],


    // TOTAL
    totalAmount: {

      type: Number,

      required: true,

    },


    // PAYMENT
    paymentMethod: {

      type: String,

      enum: ["COD", "ONLINE"],

      default: "COD",

    },

    paymentStatus: {

      type: String,

      enum: ["PENDING", "PAID", "FAILED"],

      default: "PENDING",

    },


    // ADDRESS
    deliveryAddress: {

      type: String,

      required: true,

    },


    // ORDER STATUS
    orderStatus: {

      type: String,

      enum: [

        "PENDING",

        "CONFIRMED",

        "PROCESSING",

        "SHIPPED",

        "OUT_FOR_DELIVERY",

        "DELIVERED",

        "COMPLETED",

        "CANCELLED",

      ],

      default: "PENDING",

    },


    // RAZORPAY
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


    // COMPLETED
    isCompleted: {
      type: Boolean,
      default: false,
    },

  },

  {
    timestamps: true,
  }

);

module.exports = mongoose.model(
  "PetOrder",
  petOrderSchema
);