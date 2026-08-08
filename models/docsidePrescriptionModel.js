// models/docsidePrescriptionModel.js

const mongoose =
  require("mongoose");



/* =========================
   💊 MEDICINE SCHEMA
========================= */

const medicineSchema =
  new mongoose.Schema({

    medicineName: {
      type: String,
      default: "",
    },

    dosage: {
      type: String,
      default: "",
    },

    frequency: {
      type: String,
      default: "",
    },

    duration: {
      type: String,
      default: "",
    },

    instructions: {
      type: String,
      default: "",
    },

  });



/* =========================
   🩺 PRESCRIPTION SCHEMA
========================= */

const docsidePrescriptionSchema =
  new mongoose.Schema({

    // ✅ APPOINTMENT ID
    appointmentId: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: "Appointment",

      required: true,

    },



    // ✅ DOCTOR ID
    doctorId: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: "Doctor",

      required: true,

    },



    // ✅ USER ID
    userId: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,

    },



    // ✅ CHIEF COMPLAINTS
    chiefComplaints: {

      type: String,

      default: "",

    },



    // ✅ EXAMINATION FINDINGS
    examinationFindings: {

      type: String,

      default: "",

    },



    // ✅ PROVISIONAL DIAGNOSIS
    provisionalDiagnosis: {

      type: String,

      default: "",

    },



    // ✅ CLINICAL NOTES
    clinicalNotes: {

      type: String,

      default: "",

    },



    // ✅ PRESCRIBED MEDICINES
    medicines: [
      medicineSchema
    ],



    // ✅ LAB INVESTIGATIONS
    labInvestigations: [

      {
        type: String,
      },

    ],



    // ✅ DIETARY INSTRUCTIONS
    dietaryInstructions: {

      type: String,

      default: "",

    },



    // ✅ DOCTOR ADVICE
    doctorsAdvice: {

      type: String,

      default: "",

    },



    // ✅ PDF URL
    pdfUrl: {

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
    "DocsidePrescription",
    docsidePrescriptionSchema
  );