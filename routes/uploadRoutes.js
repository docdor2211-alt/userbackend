// const express = require("express");
// const router = express.Router();

// const upload = require("../middleware/upload"); // ✅ NO {}
// const uploadToBunny = require("../utils/bunnyUpload");

// router.post("/", upload.single("file"), async (req, res) => {
//   try {
//     const url = await uploadToBunny(req.file);

//     res.json({
//       success: true,
//       url,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();

const upload =
  require("../middleware/upload");

const {
  uploadVideo,
} = require("../controllers/videoController");

router.post(
  "/upload",
  upload.single("video"),
  uploadVideo
);

module.exports = router;