// models/offerModel.js

const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(

  {
    // ================= TITLE =================

    title: {
      type: String,
      required: true,
      trim: true,
    },



    // ================= TAGLINE =================

    tagline: {
      type: String,
      default: "",
      trim: true,
    },



    // ================= DESCRIPTION =================

    desc: {
      type: String,
      default: "",
      trim: true,
    },



    // ================= DISCOUNT =================

    discount: {
      type: String,
      default: "",
      trim: true,
    },



    // ================= SPECIALTY =================

    specialty: {

      type: String,

      enum: [

        "Dental",

        "Eye Care",

        "Cardiology",

        "Neurology",

        "Orthopedic",

        "General Physician",
      ],

      required: true,
    },
    // ================= DOCTOR =================

doctorIds: [
  {
    type:
      mongoose.Schema.Types.ObjectId,

    ref: "Doctor",
  },
],



    // ================= IMAGE =================

    image: {

      url: {

        type: String,

        default: "",
      },

      publicId: {

        type: String,

        default: "",
      },
    },



    // ================= ACTIVE STATUS =================

    isActive: {

      type: Boolean,

      default: true,
    },

  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Offer",
  offerSchema
);