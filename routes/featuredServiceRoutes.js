// routes/featuredServiceRoutes.js

const express = require("express");

const router = express.Router();

const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
});

const {

  createFeaturedService,

  getFeaturedServices,

  getFeaturedServiceById,

  updateFeaturedService,

  deleteFeaturedService,

} = require(
  "../controllers/featuredServiceController"
);



// ================= CREATE =================

router.post(

  "/",

  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),

  createFeaturedService
);



// ================= GET ALL =================

router.get(
  "/",
  getFeaturedServices
);



// ================= GET SINGLE =================

router.get(
  "/:id",
  getFeaturedServiceById
);



// ================= UPDATE =================

router.put(

  "/:id",

  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),

  updateFeaturedService
);



// ================= DELETE =================

router.delete(
  "/:id",
  deleteFeaturedService
);


module.exports = router;