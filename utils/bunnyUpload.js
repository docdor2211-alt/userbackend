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

//////////////////////////////////////////////////////////////////////////
// const axios = require("axios");

// const uploadToBunny = async (file) => {
//   try {
//     const fileName = `${Date.now()}-${file.originalname}`;

//     const storageZone = process.env.BUNNY_STORAGE_ZONE;
//     const accessKey = process.env.BUNNY_STORAGE_PASSWORD;

//     const url = `https://storage.bunnycdn.com/${storageZone}/${fileName}`;

//     await axios.put(
//       url,
//       file.buffer,
//       {
//         headers: {
//           AccessKey: accessKey,
//           "Content-Type": file.mimetype,
//         },
//         maxBodyLength: Infinity,
//       }
//     );

//     return {
//       url: `https://${process.env.BUNNY_CDN_HOSTNAME}/${fileName}`,
//       publicId: fileName,
//     };
//   } catch (error) {
//     console.log(
//       "Bunny Upload Error =>",
//       error.response?.data || error.message
//     );

//     throw error;
//   }
// };

// module.exports = {
//   uploadToBunny,
// };

/////////////////////////////////////////////////////////////////////////////
const axios = require("axios");

const BUNNY_STORAGE_ZONE =
  process.env.BUNNY_STORAGE_ZONE;

const BUNNY_ACCESS_KEY =
  process.env.BUNNY_ACCESS_KEY;

const BUNNY_CDN_URL =
  process.env.BUNNY_CDN_URL;

const BUNNY_STORAGE_ENDPOINT =
  process.env.BUNNY_STORAGE_ENDPOINT;


// =====================================================
// UPLOAD TO BUNNY STORAGE
// =====================================================

const uploadToBunny = async (
  buffer,
  fileName,
  folder = "riders/documents"
) => {
  try {
    // ================================================
    // ENV CHECK
    // ================================================

    if (!BUNNY_STORAGE_ZONE) {
      throw new Error(
        "BUNNY_STORAGE_ZONE is missing"
      );
    }

    if (!BUNNY_ACCESS_KEY) {
      throw new Error(
        "BUNNY_ACCESS_KEY is missing"
      );
    }

    if (!BUNNY_CDN_URL) {
      throw new Error(
        "BUNNY_CDN_URL is missing"
      );
    }

    if (!BUNNY_STORAGE_ENDPOINT) {
      throw new Error(
        "BUNNY_STORAGE_ENDPOINT is missing"
      );
    }


    // ================================================
    // CLEAN VALUES
    // ================================================

    const endpoint =
      BUNNY_STORAGE_ENDPOINT.replace(
        /\/$/,
        ""
      );

    const storageZone =
      BUNNY_STORAGE_ZONE.replace(
        /^\/|\/$/g,
        ""
      );

    const cleanFolder =
      folder.replace(
        /^\/|\/$/g,
        ""
      );

    const cleanFileName =
      fileName.replace(
        /^\/|\/$/g,
        ""
      );


    // ================================================
    // STORAGE PATH
    // ================================================

    const filePath =
      `${cleanFolder}/${cleanFileName}`;


    // ================================================
    // BUNNY UPLOAD URL
    // ================================================

    const uploadUrl =
      `${endpoint}/` +
      `${storageZone}/` +
      `${filePath}`;


    console.log(
      "===================================="
    );

    console.log(
      "BUNNY STORAGE ZONE:",
      storageZone
    );

    console.log(
      "BUNNY UPLOAD URL:",
      uploadUrl
    );

    console.log(
      "FILE NAME:",
      cleanFileName
    );

    console.log(
      "FILE SIZE:",
      buffer.length
    );

    console.log(
      "===================================="
    );


    // ================================================
    // UPLOAD
    // ================================================

    const response =
      await axios.put(
        uploadUrl,
        buffer,
        {
          headers: {
            AccessKey:
              BUNNY_ACCESS_KEY,

            "Content-Type":
              "application/octet-stream",

            "Content-Length":
              buffer.length,
          },

          maxBodyLength:
            Infinity,

          maxContentLength:
            Infinity,

          validateStatus: () => true,
        }
      );


    // ================================================
    // DEBUG RESPONSE
    // ================================================

    console.log(
      "BUNNY STATUS:",
      response.status
    );

    console.log(
      "BUNNY RESPONSE:",
      response.data
    );


    // ================================================
    // CHECK FAILURE
    // ================================================

    if (
      response.status < 200 ||
      response.status >= 300
    ) {

      throw new Error(
        `Bunny upload failed. Status: ${response.status}. Response: ${JSON.stringify(
          response.data
        )}`
      );

    }


    // ================================================
    // CDN URL
    // ================================================

    const cdnBase =
      BUNNY_CDN_URL.replace(
        /\/$/,
        ""
      );


    const finalUrl =
      `${cdnBase}/${filePath}`;


    console.log(
      "BUNNY CDN URL:",
      finalUrl
    );


    return finalUrl;

  } catch (error) {

    console.error(
      "===================================="
    );

    console.error(
      "❌ BUNNY UPLOAD ERROR"
    );

    console.error(
      "Message:",
      error.message
    );

    console.error(
      "Status:",
      error.response?.status
    );

    console.error(
      "Response:",
      error.response?.data
    );

    console.error(
      "===================================="
    );


    // IMPORTANT:
    // Actual error frontend ko bhejne ke liye
    // original message preserve kar rahe hain.

    throw new Error(
      error.message ||
      "Failed to upload file to Bunny"
    );
  }
};


module.exports = {
  uploadToBunny,
};