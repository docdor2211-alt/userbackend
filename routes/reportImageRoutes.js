const express =
  require("express");

const router =
  express.Router();

const upload =
  require(
    "../middleware/upload"
  );

const {

  uploadReportImage,

  getDoctorImages,

} = require(
  "../controllers/reportImageController"
);

const {

  protect,

} = require(
  "../middleware/authMiddleware"
);



// USER UPLOAD

router.post(

  "/upload",

  protect,

  upload.single("image"),

  uploadReportImage

);



// DOCTOR GET

router.get(

  "/doctor-images",

  protect,

  getDoctorImages

);

module.exports =
  router;