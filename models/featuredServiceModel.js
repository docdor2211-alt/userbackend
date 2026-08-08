// models/featuredServiceModel.js

const mongoose = require("mongoose");

const featuredServiceSchema = new mongoose.Schema(

  {

    // ================= CARD =================

    title: {
      type: String,
      required: true,
      trim: true,
    },

    subtitle: {
      type: String,
      default: "",
    },

    headerText: {
      type: String,
      default: "",
    },

    badgeText: {
      type: String,
      default: "",
    },

    iconText: {
      type: String,
      default: "",
    },



    // ================= BENEFITS =================

    benefits: [
      {
        type: String,
      }
    ],



    // ================= TIME SLOTS =================

    timeSlots: [
      {
        type: String,
      }
    ],



    // ================= PRICE =================

    price: {
      type: Number,
      required: true,
    },
    // ================= DOCTOR =================

doctorId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Doctor",
  default: null,
},



    // ================= COLORS =================

    themeColor: {
      type: String,
      default: "#3F1D9B",
    },

    gradient: [

      {
        type: String,
      }
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
     serviceDate: {
      type: Date,
      required: true,
    },



    // ================= ACTIVE =================

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
  "FeaturedService",
  featuredServiceSchema
);