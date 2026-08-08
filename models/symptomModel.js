// const mongoose = require("mongoose");

// const symptomSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true
//     },

//     image: {
//       url: {
//         type: String,
//         required: true
//       },
//       publicId: {
//         type: String,
//         required: true
//       }
//     },

//     color: {
//       type: String,
//       default: "#000000"
//     },

//     // 🔥 DOCTOR RELATION
//     doctors: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Doctor"
//       }
//     ]
//   },
//   { timestamps: true }
// );

// module.exports =
//   mongoose.models.Symptom || mongoose.model("Symptom", symptomSchema);

const mongoose = require("mongoose");

const symptomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SymptomCategory",
      required: true,
    },

    color: {
      type: String,
      default: "#3b82f6",
    },

    doctors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
      },
    ],

    image: {
      url: String,
      publicId: String,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Symptom", symptomSchema);