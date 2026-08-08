const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

const {

  createLabTest,
  getLabTests,
  getLabTestById,
  updateLabTest,
  deleteLabTest,

} = require("../controllers/labTestController");


// CREATE
router.post(
  "/",
  upload.fields([{ name: "image", maxCount: 1 }]),
  createLabTest
);


// GET ALL
router.get("/", getLabTests);


// GET SINGLE
router.get("/:id", getLabTestById);


// UPDATE
router.put(
  "/:id",
  upload.fields([{ name: "image", maxCount: 1 }]),
  updateLabTest
);


// DELETE
router.delete("/:id", deleteLabTest);


module.exports = router;