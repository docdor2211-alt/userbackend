const mongoose = require("mongoose");

const labCategorySchema = new mongoose.Schema(
  {
    // 🔹 Category Name
    name: {
      type: String,
      required: [true, "Category name required"],
      trim: true,
    },

    // 🔹 Image (icon)
    image: {
      url: {
        type: String,
        required: [true, "Image URL required"],
      },
      publicId: {
        type: String,
        required: [true, "Image publicId required"],
      },
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.LabCategory ||
  mongoose.model("LabCategory", labCategorySchema);