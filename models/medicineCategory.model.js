
const mongoose = require("mongoose");

const medicineCategorySchema =
  new mongoose.Schema(
    {
      // ✅ MAIN CATEGORY
      category: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Category",

        required: true,
      },

      // ✅ TAB TITLE
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
    "MedicineCategory",
    medicineCategorySchema
  );

