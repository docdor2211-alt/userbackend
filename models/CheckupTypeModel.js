const mongoose = require("mongoose");

const checkupTypeSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },

  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  image: {

    url: String,

    publicId: String,
  },

}, {
  timestamps: true,
});

module.exports = mongoose.model(
  "CheckupType",
  checkupTypeSchema
);