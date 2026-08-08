const mongoose = require("mongoose");

const onlineConsultationSymptomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: true,
      trim: true
    },

    image: {
      url: {
        type: String,
        required: [true, "Image URL is required"]
      },
      publicId: {
        type: String,
        required: [true, "Public ID is required"]
      }
    },

   

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);


// 🔥 SAFE EXPORT (overwrite error se bachne ke liye)
module.exports =
  mongoose.models.OnlineConsultationSymptom ||
  mongoose.model(
    "OnlineConsultationSymptom",
    onlineConsultationSymptomSchema,
    "online_consultation_symptoms" // 🔥 custom collection name
  );