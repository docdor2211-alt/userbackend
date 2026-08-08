// const express = require("express");

// const router = express.Router();

// const controller = require(
//   "../controllers/appointmentController"
// );

// const {
//   protect,
//   adminOnly,
// } = require(
//   "../middleware/authMiddleware"
// );



// /* =========================
//    👤 USER ROUTES
// ========================= */

// // ✅ BOOK APPOINTMENT
// router.post(
//   "/",
//   protect,
//   controller.bookAppointment
// );

// // ✅ GET MY APPOINTMENTS
// router.get(
//   "/my",
//   protect,
//   controller.getMyAppointments
// );

// // ✅ GET SINGLE APPOINTMENT
// router.get(
//   "/:id",
//   protect,
//   controller.getAppointmentById
// );

// // ✅ CANCEL APPOINTMENT
// router.put(
//   "/:id/cancel",
//   protect,
//   controller.cancelAppointment
// );




// /* =========================
//    👨‍⚕️ DOCTOR ROUTES
// ========================= */

// // ✅ GET DOCTOR APPOINTMENTS
// router.get(
//   "/doctor/my-appointments",
//   protect,
//   controller.getDoctorAppointments
// );

// // ✅ COMPLETE APPOINTMENT
// router.put(
//   "/:id/complete",
//   protect,
//   controller.completeAppointment
// );

// // ✅ UPDATE VITALS
// router.put(
//   "/:id/vitals",
//   protect,
//   controller.updateVitals
// );




// /* =========================
//    👑 ADMIN ROUTES
// ========================= */

// // ✅ GET ALL APPOINTMENTS
// router.get(
//   "/admin/all",
//   protect,
//   adminOnly,

//   async (req, res) => {
//     try {
//       const Appointment =
//         require(
//           "../models/appointmentModel"
//         );

//       const data =
//         await Appointment.find()
//           .populate(
//             "doctorId",
//             "name speciality fees image"
//           )
//           .populate(
//             "userId",
//             "fullname email phone"
//           )
//           .sort({
//             createdAt: -1,
//           });

//       res.json({
//         success: true,
//         count: data.length,
//         data,
//       });

//     } catch (error) {

//       res.status(500).json({
//         success: false,
//         message:
//           error.message,
//       });

//     }
//   }
// );

// module.exports = router;



const express =
  require("express");

const router =
  express.Router();



// ======================================================
// CONTROLLER
// ======================================================

const controller =
  require(
    "../controllers/appointmentController"
  );



// ======================================================
// MIDDLEWARE
// ======================================================

const {

  protect,

  adminOnly,

} = require(
  "../middleware/authMiddleware"
);





/* =====================================================
   👤 USER ROUTES
===================================================== */


// ✅ CREATE APPOINTMENT ORDER
router.post(
  "/create-order",

  protect,

  controller.bookAppointment
);


// ✅ VERIFY PAYMENT
router.post(
  "/verify-payment",

  protect,

  controller.verifyAppointmentPayment
);

// // ✅ RECEIVE SETTLEMENT
// router.put(
//   "/settle-payment/:id",

//   protect,

//   controller.receiveSettlement
// );



// ✅ GET MY APPOINTMENTS
router.get(
  "/my",

  protect,

  controller.getMyAppointments
);


// ✅ GET SINGLE APPOINTMENT
router.get(
  "/:id",

  protect,

  controller.getAppointmentById
);


// ✅ CANCEL APPOINTMENT
router.put(
  "/:id/cancel",

  protect,

  controller.cancelAppointment
);





/* =====================================================
   👨‍⚕️ DOCTOR ROUTES
===================================================== */


// ✅ GET DOCTOR APPOINTMENTS
router.get(
  "/doctor/my-appointments",

  protect,

  controller.getDoctorAppointments
);

// ✅ GET DOCTOR EARNINGS
router.get(
  "/doctor/my-earnings",

  protect,

  controller.getDoctorEarnings
);




// ✅ COMPLETE APPOINTMENT
router.put(
  "/:id/complete",

  protect,

  controller.completeAppointment
);


// ✅ UPDATE VITALS
router.put(
  "/:id/vitals",

  protect,

  controller.updateVitals
);





/* =====================================================
   👑 ADMIN ROUTES
===================================================== */


// ✅ GET ALL APPOINTMENTS
router.get(
  "/admin/all",

  protect,

  adminOnly,

  async (req, res) => {

    try {

      const Appointment =
        require(
          "../models/appointmentModel"
        );

      const data =
        await Appointment.find()

          .populate(
            "doctorId",
            "name speciality fees image"
          )

          .populate(
            "userId",
            "fullname email phone"
          )

          .sort({
            createdAt: -1,
          });

      res.status(200).json({

        success: true,

        count:
          data.length,

        data,
      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,
      });

    }

  }
);



// ✅ SETTLE DOCTOR PAYMENT
router.put(
  "/admin/settle-payment/:id",

  protect,

  adminOnly,

  controller.settleDoctorPayment
);




/* =====================================================
   EXPORT ROUTER
===================================================== */

module.exports =
  router;

