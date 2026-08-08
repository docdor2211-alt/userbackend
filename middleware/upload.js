// const multer =
//   require("multer");

// const storage =
//   multer.memoryStorage();

// const upload =
//   multer({

//     storage,

//   });

// module.exports =
//   upload;

// middleware/upload.js

const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
});

module.exports = upload;