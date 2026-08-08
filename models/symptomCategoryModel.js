const mongoose = require("mongoose");

const symptomCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    image: {
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
    },

    color: {
      type: String,
      default: "#3b82f6",
    },
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.SymptomCategory ||
  mongoose.model("SymptomCategory", symptomCategorySchema);