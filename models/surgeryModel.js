const mongoose = require("mongoose");

const surgerySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    // ✅ CATEGORY ID (relation)
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SurgeryCategory",
      required: true
    },

    duration: {
      type: String,
      required: true
    },

    icon: {
      url: {
        type: String,
        required: true
      },
      publicId: {
        type: String,
        required: true
      }
    },

    benefits: [{ type: String }],

    priceRange: {
      type: String,
      default: ""
    },

    doctors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor"
      }
    ]
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Surgery ||
  mongoose.model("Surgery", surgerySchema);