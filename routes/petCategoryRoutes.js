const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

const {

  createPetCategory,
  getPetCategories,
  updatePetCategory,
  deletePetCategory,

} = require("../controllers/petCategoryController");


// CREATE
router.post(
  "/",
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  createPetCategory
);


// GET ALL
router.get("/", getPetCategories);

router.put("/:id", updatePetCategory);
// DELETE
router.delete("/:id", deletePetCategory);


module.exports = router;