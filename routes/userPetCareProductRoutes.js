const express =
  require("express");

const router =
  express.Router();

const {

  getAllUserPetCareProducts,

  getSingleUserPetCareProduct,

} = require(
  "../controllers/userPetCareProductController"
);



// ======================================================
// GET ALL PRODUCTS
// ======================================================

router.get(

  "/all",

  getAllUserPetCareProducts

);



// ======================================================
// GET SINGLE PRODUCT
// ======================================================

router.get(

  "/:id",

  getSingleUserPetCareProduct

);



module.exports =
  router;