
const mongoose = require("mongoose");

const medicineSubCategorySchema =
  new mongoose.Schema(
    {
      // ✅ TOP CATEGORY
      medicineCategory: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "MedicineCategory",

        required: true,
      },

      // ✅ CARD TITLE
      title: {
        type: String,
        required: true,
        trim: true,
      },

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
    "MedicineSubCategory",
    medicineSubCategorySchema
  );

