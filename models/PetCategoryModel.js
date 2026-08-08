const mongoose = require("mongoose");

const petCategorySchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
    trim: true,
  },

 

}, {
  timestamps: true,
});

module.exports = mongoose.model(
  "PetCategory",
  petCategorySchema
);