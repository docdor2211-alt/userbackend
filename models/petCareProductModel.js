const mongoose =
  require("mongoose");



// ======================================================
// PET CATEGORY SCHEMA
// ======================================================

const petCategorySchema =
  new mongoose.Schema({

    title: {
      type: String,
    },

    image: {

      url: {
        type: String,
      },

    },

  });



// ======================================================
// PET CARE PRODUCT SCHEMA
// ======================================================

const petCareProductSchema =
  new mongoose.Schema(

    {

      title: String,

      shortDescription: String,

      description: String,



      petCategory:
        petCategorySchema,



      needType: {

        type: String,

        enum: [

          "food",

          "medicines",

          "toys",

          "accessories",

          "other",

        ],

      },



      price: Number,



      weight: String,



      flavor: String,



      ageType: {

        type: String,

        enum: [

          "baby",

          "adult",

          "senior",

          "all",

        ],

      },



      rating: Number,



      stock: Number,



      image: {

        url: String,

      },



      isAvailable: Boolean,

    },

    {

      timestamps: true,

    }

  );



module.exports =
  mongoose.model(

    "PetCareProduct",

    petCareProductSchema

  );