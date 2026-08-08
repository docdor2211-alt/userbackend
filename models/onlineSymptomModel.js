const mongoose = require("mongoose");

const onlineSymptomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    image: {
      url: {
        type: String,
        required: true
      },
      publicId: {
        type: String,
        required: true
      }
    },

    color: {
      type: String,
      default: "#000000"
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
  mongoose.models.OnlineSymptom ||
  mongoose.model("OnlineSymptom", onlineSymptomSchema);