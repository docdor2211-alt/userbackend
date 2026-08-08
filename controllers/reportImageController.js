// const ReportImage =
//   require(
//     "../models/reportImageModel"
//   );



// // ======================================================
// // USER - UPLOAD IMAGE
// // ======================================================

// exports.uploadReportImage =
//   async (req, res) => {

//     try {

//       const {

//         doctorId,

//         title,

//         description,

//       } = req.body;



//       // IMAGE CHECK

//       if (!req.file) {

//         return res.status(400).json({

//           success: false,

//           message:
//             "Image is required",

//         });

//       }



//       // IMAGE PATH

//       const image =
//         `/uploads/${req.file.filename}`;



//       // SAVE

//       const report =
//         await ReportImage.create({

//           userId:
//             req.user._id,

//           doctorId,

//           title,

//           description,

//           image,

//         });



//       res.status(201).json({

//         success: true,

//         message:
//           "Image uploaded successfully",

//         data:
//           report,

//       });

//     } catch (error) {

//       console.log(error);

//       res.status(500).json({

//         success: false,

//         message:
//           error.message,

//       });

//     }

//   };



// // ======================================================
// // DOCTOR - GET USER IMAGES
// // ======================================================

// exports.getDoctorImages =
//   async (req, res) => {

//     try {

//       const reports =
//         await ReportImage.find({

//           doctorId:
//             req.user._id,

//         })

//           .populate({

//             path: "userId",

//             select:
//               "fullname email phone",

//           })

//           .sort({

//             createdAt: -1,

//           });



//       res.status(200).json({

//         success: true,

//         total:
//           reports.length,

//         data:
//           reports,

//       });

//     } catch (error) {

//       res.status(500).json({

//         success: false,

//         message:
//           error.message,

//       });

//     }

//   };


const ReportImage =
  require(
    "../models/reportImageModel"
  );

const uploadToBunny =
  require(
    "../utils/bunnyUpload"
  );



// IMPORTANT
require(
  "../models/userModel"
);



// ======================================================
// USER - UPLOAD IMAGE
// ======================================================

exports.uploadReportImage =
  async (req, res) => {

    try {

      const {

        doctorId,

        title,

        description,

      } = req.body;



      // ==========================================
      // CHECK IMAGE
      // ==========================================

      if (!req.file) {

        return res.status(400).json({

          success: false,

          message:
            "Image is required",

        });

      }



      // ==========================================
      // UPLOAD TO BUNNY CDN
      // ==========================================

      const upload =
        await uploadToBunny(

          req.file

        );



      // ==========================================
      // CHECK UPLOAD
      // ==========================================

      if (!upload.success) {

        return res.status(500).json({

          success: false,

          message:
            "Image upload failed",

        });

      }



      // ==========================================
      // SAVE REPORT
      // ==========================================

      const report =
        await ReportImage.create({

          userId:
            req.user._id,

          doctorId,

          title,

          description,

          image:
            upload.url,

        });



      // ==========================================
      // RESPONSE
      // ==========================================

      res.status(201).json({

        success: true,

        message:
          "Image uploaded successfully",

        data:
          report,

      });

    } catch (error) {

      console.log(

        "UPLOAD REPORT ERROR =>",

        error

      );



      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };



// ======================================================
// DOCTOR - GET USER IMAGES
// ======================================================

exports.getDoctorImages =
  async (req, res) => {

    try {

      // ==========================================
      // CHECK DOCTOR
      // ==========================================

      if (!req.doctor) {

        return res.status(401).json({

          success: false,

          message:
            "Doctor not authenticated",

        });

      }



      // ==========================================
      // GET REPORTS
      // ==========================================

      const reports =
        await ReportImage.find({

          doctorId:
            req.doctor._id,

        })

          .populate({

            path: "userId",

            select:
              "fullname email phone image",

          })

          .sort({

            createdAt: -1,

          });



      // ==========================================
      // RESPONSE
      // ==========================================

      res.status(200).json({

        success: true,

        message:
          "Doctor images fetched successfully",

        total:
          reports.length,

        data:
          reports,

      });

    } catch (error) {

      console.log(

        "GET DOCTOR IMAGES ERROR =>",

        error

      );



      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };