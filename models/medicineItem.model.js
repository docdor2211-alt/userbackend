
const mongoose = require("mongoose");

const medicineItemSchema =
  new mongoose.Schema(
    {
      // ✅ SUB CATEGORY
      medicineSubCategory: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "MedicineSubCategory",

        required: true,
      },

      // ✅ NAME
      name: {
        type: String,
        required: true,
        trim: true,
      },

      description: {
        type: String,
        default: "",
      },

      image: {
        url: {
          type: String,
          default: ""
        },

        publicId: {
          type: String,
          default: ""
        },
      },

      price: {
        type: Number,
        required: true,
      },

      isActive: {
        type: Boolean,
        default: true,
      },
    },

    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "MedicineItem",
    medicineItemSchema
  );

