const mongoose = require("mongoose");

const doctorSchema =
  new mongoose.Schema(
    {
      // ================= BASIC =================

      name: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
      },

      password: {
        type: String,
      },

      phoneNumber: {
        type: String,
        default: "",
      },



      // ================= PROFESSIONAL =================

      degree: {
        type: String,
        trim: true,
      },

      qualification: {
        type: String,
        default: "",
      },

      speciality: {
        type: String,
        trim: true,
      },

      experience: {
        type: String,
        trim: true,
      },

      fees: {
        type: Number,
        default: 0,
      },



      // ================= IMAGE =================

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



      // ================= RATING =================

      rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },

      reviews: {
        type: Number,
        default: 0,
      },



      // ================= LOCATION =================

      location: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },

        coordinates: {
          type: [Number],
          required: true,
        },
      },

      address: {
        type: String,
        default: "",
      },

      city: {
        type: String,
        default: "",
      },

      state: {
        type: String,
        default: "",
      },

      pincode: {
        type: String,
        default: "",
      },



      // ================= STATUS =================

      isActive: {
        type: Boolean,
        default: true,
      },

      isApproved: {
        type: Boolean,
        default: false,
      },

      isBlocked: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );



// ================= GEO INDEX =================

doctorSchema.index({
  location: "2dsphere",
});



module.exports =
  mongoose.models.Doctor ||
  mongoose.model(
    "Doctor",
    doctorSchema
  );