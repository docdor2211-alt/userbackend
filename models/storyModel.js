const mongoose =
  require("mongoose");

const storySchema =
  new mongoose.Schema(

    {

      doctorId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Doctor",

        required: true,

      },

      title: {

        type: String,

        required: true,

      },

      imageUrl: {

        type: String,

        required: true,

      },

      thumbUrl: {

        type: String,

        default: "",

      },

      linkUrl: {

        type: String,

        default: "",

      },

      isActive: {

        type: Boolean,

        default: true,

      },
      expiresAt: {
        type: Date,
        required: true,
        index: true,
      }

    },

    {

      timestamps: true,

    }

  );

module.exports =
  mongoose.model(

    "Story",

    storySchema

  );