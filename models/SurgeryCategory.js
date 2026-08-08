const mongoose = require("mongoose");

const surgeryCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    }
  },
  { timestamps: true }
);

// ❌ old
// module.exports = mongoose.model("SurgeryCategory", surgeryCategorySchema);

// ✅ FIXED
module.exports =
  mongoose.models.SurgeryCategory ||
  mongoose.model("SurgeryCategory", surgeryCategorySchema);