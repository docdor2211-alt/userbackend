const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    // 🔹 Medicine name
    name: {
      type: String,
      required: [true, "Medicine name required"],
      trim: true,
    },

    // 🔹 Image
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

    // 🔹 SubCategory ID (manual store)
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: [true, "SubCategory required"],
    },

    // 🔹 Medicine Items IDs (manual store, NO LINKING LOGIC)
    medicineItems: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "MedicineItem",
      default: [],
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Medicine ||
  mongoose.model("Medicine", medicineSchema);