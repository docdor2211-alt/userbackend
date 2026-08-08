// const axios = require("axios");
// const fs = require("fs");

// const uploadToBunny = async (file) => {

//   const fileName = `${Date.now()}-${file.originalname}`;

//   const url = `${process.env.BUNNY_STORAGE}/${fileName}`;

//   const response = await axios.put(
//     url,
//     fs.readFileSync(file.path),
//     {
//       headers: {
//         AccessKey: process.env.BUNNY_API_KEY,
//         "Content-Type": file.mimetype,
//       },
//     }
//   );

//   return {
//     url: `${process.env.BUNNY_PULL_ZONE}/${fileName}`,
//     publicId: fileName,
//   };
// };

// module.exports = {
//   uploadToBunny,
// };

// utils/bunnyUpload.js

const axios = require("axios");

const uploadToBunny = async (file) => {
  try {
    const fileName = `${Date.now()}-${file.originalname}`;

    const storageZone = process.env.BUNNY_STORAGE_ZONE;
    const accessKey = process.env.BUNNY_STORAGE_PASSWORD;

    const url = `https://storage.bunnycdn.com/${storageZone}/${fileName}`;

    await axios.put(
      url,
      file.buffer,
      {
        headers: {
          AccessKey: accessKey,
          "Content-Type": file.mimetype,
        },
        maxBodyLength: Infinity,
      }
    );

    return {
      url: `https://${process.env.BUNNY_CDN_HOSTNAME}/${fileName}`,
      publicId: fileName,
    };
  } catch (error) {
    console.log(
      "Bunny Upload Error =>",
      error.response?.data || error.message
    );

    throw error;
  }
};

module.exports = {
  uploadToBunny,
};