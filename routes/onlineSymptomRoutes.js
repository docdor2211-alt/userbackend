const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const {
  createOnlineSymptom,
  getOnlineSymptoms,
  getOnlineSymptomById,
  updateOnlineSymptom,
  deleteOnlineSymptom
} = require("../controllers/onlineSymptomController");

router.post("/", upload.fields([{ name: "image", maxCount: 1 }]), createOnlineSymptom);

router.get("/", getOnlineSymptoms);

router.get("/:id", getOnlineSymptomById);

router.put("/:id", upload.fields([{ name: "image", maxCount: 1 }]), updateOnlineSymptom);

router.delete("/:id", deleteOnlineSymptom);

module.exports = router;