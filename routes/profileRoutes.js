const express = require("express");

const router = express.Router();


// ================= MIDDLEWARE =================

const upload = require("../middleware/upload");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");


// ================= CONTROLLER =================

const {
  createProfile,
  getProfiles,
  getProfileById,
  updateProfile,
  deleteProfile,
} = require("../controllers/profileController");



// ================= CREATE PROFILE =================

router.post(
  "/create",

  protect,

  upload.fields([
    {
      name: "profileImage",
      maxCount: 1,
    },
  ]),

  createProfile
);



// ================= GET ALL PROFILES =================

// 👉 admin only

router.get(
  "/all",

  protect,



  getProfiles
);



// ================= GET SINGLE PROFILE =================

router.get(
  "/:id",

  protect,

  getProfileById
);



// ================= UPDATE PROFILE =================

router.put(
  "/update/:id",

  protect,

  upload.fields([
    {
      name: "profileImage",
      maxCount: 1,
    },
  ]),

  updateProfile
);



// ================= DELETE PROFILE =================

// 👉 admin only

router.delete(
  "/delete/:id",

  protect,

  adminOnly,

  deleteProfile
);

module.exports = router;