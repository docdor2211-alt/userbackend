const mongoose =
  require("mongoose");

const reportImageSchema =
  new mongoose.Schema(

    {

      // USER

      userId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

      },



      // DOCTOR

      doctorId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Doctor",

        required: true,

      },



      // TITLE

      title: {

        type: String,

        default: "",

      },



      // IMAGE

      image: {

        type: String,

        required: true,

      },



      // DESCRIPTION

      description: {

        type: String,

        default: "",

      },

    },

    {

      timestamps: true,

    }

  );

module.exports =
  mongoose.model(

    "ReportImage",

    reportImageSchema

  );