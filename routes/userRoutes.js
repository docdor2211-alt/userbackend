
const express =
  require("express");

const router =
  express.Router();

const {

  registerUser,

  loginUser,

  googleLogin,

  getUserProfile,

  updateUserProfile,

  deleteUser,
  getAllUsers,
  getGoogleUsers,

} = require(
  "../controllers/userController"
);

const {

  protect,

  adminOnly,

} = require(
  "../middleware/authMiddleware"
);



/* =========================
   🔓 PUBLIC ROUTES
========================= */

// REGISTER USER

router.post(
  "/register",
  registerUser
);


// LOGIN USER

router.post(
  "/login",
  loginUser
);


// GOOGLE LOGIN

router.post(
  "/google-login",
  googleLogin
);
/* =========================
   🔵 GOOGLE USERS
========================= */

router.get(
  "/google-users",
  protect,
  adminOnly,
  getGoogleUsers
);
/* =========================
   👑 GET ALL USERS
========================= */

router.get(
  "/all-users",
  
  getAllUsers
);


/* =========================
   🔒 PROTECTED ROUTES
========================= */

// GET USER PROFILE

router.get(
  "/profile",
  protect,
  getUserProfile
);


// UPDATE USER PROFILE

router.put(
  "/profile",
  protect,
  updateUserProfile
);



/* =========================
   👑 ADMIN ONLY ROUTES
========================= */

// DELETE USER

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteUser
);



module.exports =
  router;

