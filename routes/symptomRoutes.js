// const express = require("express");
// const router = express.Router();

// const multer = require("multer");
// const upload = multer({ storage: multer.memoryStorage() });

// const {
//   createSymptom,
//   getSymptoms,
//   getSymptomById,
//   updateSymptom,
//   deleteSymptom
// } = require("../controllers/symptomController");


// // CREATE
// router.post("/", upload.fields([{ name: "image", maxCount: 1 }]), createSymptom);

// // GET ALL
// router.get("/", getSymptoms);

// // GET ONE
// router.get("/:id", getSymptomById);

// // UPDATE
// router.put("/:id", upload.fields([{ name: "image", maxCount: 1 }]), updateSymptom);

// // DELETE
// router.delete("/:id", deleteSymptom);

// module.exports = router;

const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const {
  createSymptom,
  getSymptoms,
  getSymptomById,
  updateSymptom,
  deleteSymptom
} = require("../controllers/symptomController");


// CREATE
router.post("/", upload.fields([{ name: "image", maxCount: 1 }]), createSymptom);

// GET ALL
router.get("/", getSymptoms);

// GET ONE
router.get("/:id", getSymptomById);

// UPDATE
router.put("/:id", upload.fields([{ name: "image", maxCount: 1 }]), updateSymptom);

// DELETE
router.delete("/:id", deleteSymptom);

module.exports = router;