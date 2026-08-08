// models/healthPackageModel.js

const mongoose = require("mongoose");

const healthPackageSchema =
  new mongoose.Schema(
    {
      // ================= TITLE =================

      title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
      },

      // ================= SUBTITLE =================

      subtitle: {
        type: String,
        default: "",
        trim: true,
      },

      // ================= TEST COUNT =================

      testCount: {
        type: Number,
        required: true,
        default: 0,
      },

      // ================= INCLUDED TESTS =================

      includedTests: [
        {
          type: String,
          trim: true,
        },
      ],

      // ================= ORIGINAL PRICE =================

      originalPrice: {
        type: Number,
        required: true,
      },

      // ================= CURRENT PRICE =================

      currentPrice: {
        type: Number,
        required: true,
      },

      // ================= TAG =================

      tag: {
        type: String,
        default: "",
        trim: true,
      },

      // ================= CATEGORY =================

      category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "HealthPackageCategory",
        required: true,
      },

      // ================= STATUS =================

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
  "HealthPackage",
  healthPackageSchema
);