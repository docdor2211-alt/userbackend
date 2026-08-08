// models/healthPackageCategoryModel.js

const mongoose = require("mongoose");

const healthPackageCategorySchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        unique: true,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "HealthPackageCategory",
  healthPackageCategorySchema
);