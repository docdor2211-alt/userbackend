// routes/offerRoutes.js

const express = require("express");

const router = express.Router();

const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

const {

  createOffer,

  getOffers,

  getOfferById,

  updateOffer,

  deleteOffer,

} = require("../controllers/offerController");



// ================= CREATE OFFER =================

router.post(

  "/",

  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),

  createOffer
);



// ================= GET ALL OFFERS =================

router.get("/", getOffers);



// ================= GET SINGLE OFFER =================

router.get("/:id", getOfferById);



// ================= UPDATE OFFER =================

router.put(

  "/:id",

  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),

  updateOffer
);



// ================= DELETE OFFER =================

router.delete("/:id", deleteOffer);


module.exports = router;