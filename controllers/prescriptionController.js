


const Prescription =
  require(
    "../models/docsidePrescriptionModel"
  );



// =====================================================
// GET MY PRESCRIPTIONS
// =====================================================

exports.getMyPrescriptions =
  async (req, res) => {

    try {

      // ================= CHECK USER =================

      if (!req.user?._id) {

        return res.status(401).json({

          success: false,

          message:
            "User not authenticated",

        });

      }



      // ================= FIND USER PRESCRIPTIONS =================

      const prescriptions =
        await Prescription.find({

          userId:
            req.user._id,

        })

          .populate({

            path: "doctorId",

            select:
              "name email speciality image",

          })

          .populate({

            path:
              "appointmentId",

          })

          .sort({

            createdAt: -1,

          });



      // ================= RESPONSE =================

      res.status(200).json({

        success: true,

        message:
          "My prescriptions fetched successfully",

        total:
          prescriptions.length,

        data:
          prescriptions,

      });

    } catch (error) {

      console.log(
        "GET MY PRESCRIPTIONS ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };