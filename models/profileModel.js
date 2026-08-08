// models/profileModel.js

const mongoose = require("mongoose");



// ================= FAMILY MEMBER SCHEMA =================

const familyMemberSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      gender: {
        type: String,
        enum: [
          "Male",
          "Female",
          "Other",
        ],
        default: "Male",
      },

      relation: {
        type: String,
        default: "",
        trim: true,
      },

      age: {
        type: Number,
        default: 0,
      },

      isSelf: {
        type: Boolean,
        default: false,
      },
    },
    {
      _id: true,
    }
  );



// ================= PROFILE SCHEMA =================

const profileSchema =
  new mongoose.Schema(
    {
      // ================= USER NAME =================

      name: {
        type: String,
        required: true,
        trim: true,
      },

      // ================= GENDER =================

      gender: {
        type: String,
        enum: [
          "Male",
          "Female",
          "Other",
        ],
        default: "Male",
      },

      // ================= AGE =================

      age: {
        type: Number,
        default: 0,
      },

      // ================= HEIGHT =================

      height: {
        type: Number,
        default: 0,
      },

      // ================= WEIGHT =================

      weight: {
        type: Number,
        default: 0,
      },

      // ================= BLOOD GROUP =================

      bloodGroup: {
        type: String,
        enum: [
          "A+",
          "A-",
          "B+",
          "B-",
          "AB+",
          "AB-",
          "O+",
          "O-",
        ],
        default: "O+",
      },

      // ================= PROFILE IMAGE =================

      profileImage: {
        url: {
          type: String,
          default: "",
        },

        publicId: {
          type: String,
          default: "",
        },
      },

      // ================= FAMILY MEMBERS =================

      familyMembers: [
        familyMemberSchema,
      ],

      // ================= STATUS =================

      isActive: {
        type: Boolean,
        default: true,
      },
    },

    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "Profile",
  profileSchema
);