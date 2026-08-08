// models/Category.js

const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,

      // ✅ DROPDOWN VALUES
      enum: [
        "In-Person Consultation",
        "Online Consultation",
        "Surgery",
        "Order Medicines",
        "Lab Test",
        "Pet Care",
      ],

      unique: true,
    },

    slug: {
      type: String,
      lowercase: true,
      unique: true,
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

    isFree: {
      type: Boolean,
      default: false,
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

// ✅ AUTO SLUG GENERATE
categorySchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  }

  
});

module.exports = mongoose.model("Category", categorySchema);