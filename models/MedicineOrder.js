const mongoose = require("mongoose");


// ======================================================
// ORDER ITEM SCHEMA
// ======================================================

const orderItemSchema =
  new mongoose.Schema({

    name: {

      type: String,

      required: true,

      trim: true,

    },

    qty: {

      type: Number,

      required: true,

      min: 1,

    },

    price: {

      type: Number,

      required: true,

      min: 0,

    },

  });


// ======================================================
// PHARMACY ORDER SCHEMA
// ======================================================

const pharmacyOrderSchema =
  new mongoose.Schema(

    {

      // ==========================================
      // LOGIN PHARMACY
      // ==========================================

      pharmacy: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "PharmacyUser",

        required: true,

      },


      // ==========================================
      // PATIENT NAME
      // ==========================================

      patient: {

        type: String,

        required: true,

        trim: true,

      },


      // ==========================================
      // ORDER DATE
      // ==========================================

      date: {

        type: String,

        required: true,

      },


      // ==========================================
      // ORDER ITEMS
      // ==========================================

      items: {

        type: [orderItemSchema],

        default: [],

      },


      // ==========================================
      // ORDER STATUS
      // ==========================================

      status: {

        type: String,

        enum: [

          "Pending",

          "Accepted",

          "Packed",

          "Out For Delivery",

          "Delivered",

          "Cancelled",

        ],

        default: "Pending",

      },


      // ==========================================
      // DELIVERY ADDRESS
      // ==========================================

      address: {

        type: String,

        required: true,

        trim: true,

      },


      // ==========================================
      // TOTAL AMOUNT
      // ==========================================

      total: {

        type: Number,

        default: 0,

        min: 0,

      },

    },

    {

      timestamps: true,

    }

  );


// ======================================================
// EXPORT MODEL
// ======================================================

module.exports = mongoose.model(
  "MedicineOrder",
  pharmacyOrderSchema
);