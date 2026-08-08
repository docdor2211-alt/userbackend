// controllers/videoCallController.js

const { v4: uuidv4 } =
  require("uuid");

const VideoCall =
  require(
    "../models/videoCallModel"
  );

const Appointment =
  require(
    "../models/appointmentModel"
  );





/* =====================================================
   🎥 CREATE VIDEO CALL
===================================================== */

exports.createVideoCall =
  async (req, res) => {

    try {

      const {
        appointmentId
      } = req.body;



      // ✅ FIND APPOINTMENT
      const appointment =
        await Appointment.findById(
          appointmentId
        );

      if (!appointment) {

        return res.status(404).json({

          success: false,

          message:
            "Appointment not found",

        });

      }



      // ✅ CHECK EXISTING CALL
      const existingCall =
        await VideoCall.findOne({

          appointmentId,

        });

      if (existingCall) {

        return res.status(400).json({

          success: false,

          message:
            "Video call already exists",

        });

      }



      // ✅ CREATE ROOM ID
      const roomId =
        uuidv4();



      // ✅ CREATE CALL
      const call =
        await VideoCall.create({

          appointmentId,

          doctorId:
            appointment.doctorId,

          userId:
            appointment.userId,



          roomId,



          // ✅ APPOINTMENT DETAILS
          appointmentDate:
            appointment.date,

          appointmentTime:
            appointment.time,



          // ✅ PATIENT DETAILS
          patientName:
            appointment.patientName,

          issue:
            appointment.reason,

          age:
            appointment.age,

          gender:
            appointment.gender,

          weight:
            appointment.weight,



          // ✅ STATUS
          callStatus:
            "waiting",

          isCompleted:
            false,

        });



      // ✅ RESPONSE
      res.status(201).json({

        success: true,

        message:
          "Video call created successfully",

        data:
          call,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };







/* =====================================================
   📞 GET ALL MY CALLS
===================================================== */

exports.getMyCalls =
  async (req, res) => {

    try {

      let calls;



      // ✅ DOCTOR SIDE
      if (req.doctor) {

        calls =
          await VideoCall.find({

            doctorId:
              req.doctor._id,

          })

          .populate(
            "doctorId",
            "name speciality doctorImagePath"
          )

          .sort({
            createdAt: -1,
          });

      }

      // ✅ USER SIDE
      else {

        calls =
          await VideoCall.find({

            userId:
              req.user._id,

          })

          .populate(
            "doctorId",
            "name speciality doctorImagePath"
          )

          .sort({
            createdAt: -1,
          });

      }



      // ✅ RESPONSE
      res.status(200).json({

        success: true,

        count:
          calls.length,

        data:
          calls,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };







/* =====================================================
   ⏳ GET UPCOMING CALLS
===================================================== */

exports.getUpcomingCalls =
  async (req, res) => {

    try {

      let calls;



      // ✅ DOCTOR UPCOMING
      if (req.doctor) {

        calls =
          await VideoCall.find({

            doctorId:
              req.doctor._id,

            isCompleted:
              false,

          })

          .populate(
            "doctorId",
            "name speciality doctorImagePath"
          )

          .sort({
            appointmentDate: 1,
          });

      }

      // ✅ USER UPCOMING
      else {

        calls =
          await VideoCall.find({

            userId:
              req.user._id,

            isCompleted:
              false,

          })

          .populate(
            "doctorId",
            "name speciality doctorImagePath"
          )

          .sort({
            appointmentDate: 1,
          });

      }



      // ✅ RESPONSE
      res.status(200).json({

        success: true,

        count:
          calls.length,

        data:
          calls,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };







/* =====================================================
   📜 GET HISTORY CALLS
===================================================== */

exports.getHistoryCalls =
  async (req, res) => {

    try {

      let calls;



      // ✅ DOCTOR HISTORY
      if (req.doctor) {

        calls =
          await VideoCall.find({

            doctorId:
              req.doctor._id,

            isCompleted:
              true,

          })

          .populate(
            "doctorId",
            "name speciality doctorImagePath"
          )

          .sort({
            updatedAt: -1,
          });

      }

      // ✅ USER HISTORY
      else {

        calls =
          await VideoCall.find({

            userId:
              req.user._id,

            isCompleted:
              true,

          })

          .populate(
            "doctorId",
            "name speciality doctorImagePath"
          )

          .sort({
            updatedAt: -1,
          });

      }



      // ✅ RESPONSE
      res.status(200).json({

        success: true,

        count:
          calls.length,

        data:
          calls,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };







/* =====================================================
   🎥 JOIN VIDEO CALL
===================================================== */

exports.joinVideoCall =
  async (req, res) => {

    try {

      const call =
        await VideoCall.findById(
          req.params.id
        )

        .populate(
          "doctorId",
          "name speciality doctorImagePath"
        );



      if (!call) {

        return res.status(404).json({

          success: false,

          message:
            "Video call not found",

        });

      }



      // ✅ START CALL
      if (
        !call.startedAt
      ) {

        call.startedAt =
          new Date();

        call.callStatus =
          "ongoing";

        await call.save();

      }



      // ✅ RESPONSE
      res.status(200).json({

        success: true,

        message:
          "Join video call",

        data: {

          _id:
            call._id,

          roomId:
            call.roomId,

          patientName:
            call.patientName,

          appointmentDate:
            call.appointmentDate,

          appointmentTime:
            call.appointmentTime,

          issue:
            call.issue,

          doctor:
            call.doctorId,

          callStatus:
            call.callStatus,

        },

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };







/* =====================================================
   ✅ COMPLETE VIDEO CALL
===================================================== */

exports.completeCall =
  async (req, res) => {

    try {

      // ✅ FIND CALL
      const call =
        await VideoCall.findById(
          req.params.id
        );

      if (!call) {

        return res.status(404).json({

          success: false,

          message:
            "Call not found",

        });

      }



      // ✅ COMPLETE
      call.callStatus =
        "completed";

      call.isCompleted =
        true;

      call.endedAt =
        new Date();



      // ✅ CALCULATE DURATION
      if (call.startedAt) {

        const durationMs =

          new Date() -
          new Date(
            call.startedAt
          );



        call.duration =
          Math.floor(
            durationMs / 1000
          );

      }



      await call.save();



      // ✅ RESPONSE
      res.status(200).json({

        success: true,

        message:
          "Call completed successfully",

        data:
          call,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };







/* =====================================================
   ❌ CANCEL VIDEO CALL
===================================================== */

exports.cancelVideoCall =
  async (req, res) => {

    try {

      const {
        cancelReason
      } = req.body;



      const call =
        await VideoCall.findById(
          req.params.id
        );



      if (!call) {

        return res.status(404).json({

          success: false,

          message:
            "Video call not found",

        });

      }



      // ✅ CANCEL STATUS
      call.callStatus =
        "cancelled";



      // ✅ WHO CANCELLED
      if (req.doctor) {

        call.cancelledBy =
          "doctor";

      }

      else {

        call.cancelledBy =
          "user";

      }



      // ✅ REASON
      call.cancelReason =
        cancelReason || "";



      await call.save();



      // ✅ RESPONSE
      res.status(200).json({

        success: true,

        message:
          "Video call cancelled",

        data:
          call,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };