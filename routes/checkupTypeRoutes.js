// const express = require("express");

// const router = express.Router();

// const upload = require("../middleware/upload");

// const {
//   createCheckupType,
//   getCheckupTypes,
// } = require("../controllers/checkupTypeController");


// // CREATE
// router.post(
//   "/",
//   upload.fields([
//     {
//       name: "image",
//       maxCount: 1,
//     },
//   ]),
//   createCheckupType
// );


// // GET ALL
// router.get("/", getCheckupTypes);


// module.exports = router;

const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

const {
  createCheckupType,
  getCheckupTypes,
  getCheckupTypeById,
  updateCheckupType,
  deleteCheckupType,
} = require("../controllers/checkupTypeController");


// CREATE
router.post(
  "/",
  upload.fields([{ name: "image", maxCount: 1 }]),
  createCheckupType
);

// GET ALL
router.get("/", getCheckupTypes);

// GET SINGLE
router.get("/:id", getCheckupTypeById);

// UPDATE
router.put(
  "/:id",
  upload.fields([{ name: "image", maxCount: 1 }]),
  updateCheckupType
);

// DELETE
router.delete("/:id", deleteCheckupType);


module.exports = router;