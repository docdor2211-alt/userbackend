

// const Appointment = require(
//   "../models/appointmentModel"
// );

// const Doctor = require(
//   "../models/doctorModel"
// );

// // ✅ IMPORTANT
// require("../models/userModel");





// /* =========================
//    📅 BOOK APPOINTMENT
// ========================= */

// exports.bookAppointment =
//   async (req, res) => {

//     try {

//       const {

//         doctorId,

//         patientName,
//         age,
//         gender,
//         reason,

//         date,
//         time,
//         type,

//         latitude,
//         longitude,

//         bloodPressure,
//         weight,
//         temperature,

//       } = req.body;





//       /* =========================
//          ✅ VALIDATION
//       ========================= */

//       if (

//         !doctorId ||
//         !patientName ||
//         !age ||
//         !gender ||
//         !date ||
//         !time ||
//         !type

//       ) {

//         return res.status(400).json({

//           success: false,

//           message:
//             "All fields are required",

//         });

//       }





//       /* =========================
//          ✅ CHECK DOCTOR
//       ========================= */

//       const doctor =
//         await Doctor.findById(
//           doctorId
//         );



//       if (!doctor) {

//         return res.status(404).json({

//           success: false,

//           message:
//             "Doctor not found",

//         });

//       }





//       /* =========================
//          ✅ CHECK SLOT
//       ========================= */

//       const existingAppointment =
//         await Appointment.findOne({

//           doctorId,
//           date,
//           time,

//           status: {
//             $ne: "cancelled",
//           },

//         });





//       if (existingAppointment) {

//         return res.status(400).json({

//           success: false,

//           message:
//             "Slot already booked",

//         });

//       }





//       /* =========================
//          ✅ GENERATE TOKEN
//       ========================= */

//       const totalAppointments =
//         await Appointment.countDocuments({

//           doctorId,
//           date,

//         });





//       const token =
//         totalAppointments + 1;





//       /* =========================
//          ✅ CREATE APPOINTMENT
//       ========================= */

//       const appointment =
//         await Appointment.create({

//           userId:
//             req.user._id,

//           doctorId,

//           patientName,
//           age,
//           gender,
//           reason,

//           token,

//           date,
//           time,
//           type,

//           latitude,
//           longitude,

//           bloodPressure,
//           weight,
//           temperature,

//           status:
//             "approved",

//         });





//       /* =========================
//          ✅ RESPONSE
//       ========================= */

//       res.status(201).json({

//         success: true,

//         message:
//           "Appointment booked successfully",

//         data:
//           appointment,

//       });

//     } catch (error) {

//       console.log(
//         "BOOK APPOINTMENT ERROR =>",
//         error
//       );

//       res.status(500).json({

//         success: false,

//         message:
//           error.message,

//       });

//     }

//   };







// /* =========================
//    📄 GET MY APPOINTMENTS
// ========================= */

// // exports.getMyAppointments =
// //   async (req, res) => {

// //     try {

// //       const appointments =
// //         await Appointment.find({

// //           userId:
// //             req.user._id,

// //         })

// //           .populate(

// //             "doctorId",

// //             "name speciality fees image"

// //           )

// //           .sort({
// //             createdAt: -1,
// //           });





// //       res.status(200).json({

// //         success: true,

// //         count:
// //           appointments.length,

// //         data:
// //           appointments,

// //       });

// //     } catch (error) {

// //       console.log(error);

// //       res.status(500).json({

// //         success: false,

// //         message:
// //           error.message,

// //       });

// //     }

// //   };
// exports.getMyAppointments =
//   async (req, res) => {

//     try {

//       const appointments =
//         await Appointment.find({

//           userId:
//             req.user._id,

//         })

//         // FULL DOCTOR DETAIL
//         .populate({

//           path: "doctorId",

//           select:
//             "_id name email phone speciality experience gender image clinicAddress fees",

//         })

//         // FULL USER DETAIL
//         .populate({

//           path: "userId",

//           select:
//             "_id fullname email phone gender age profileImage address",

//         })

//         .sort({

//           createdAt: -1,

//         });

//       res.status(200).json({

//         success: true,

//         count:
//           appointments.length,

//         data:
//           appointments,

//       });

//     } catch (error) {

//       console.log(error);

//       res.status(500).json({

//         success: false,

//         message:
//           error.message,

//       });

//     }

// };







// /* =========================
//    👨‍⚕️ GET DOCTOR APPOINTMENTS
// ========================= */

// // exports.getDoctorAppointments =
// //   async (req, res) => {

// //     try {

// //       const appointments =
// //         await Appointment.find({

// //           doctorId:
// //             req.doctor._id,

// //         })

// //           .populate(

// //             "userId",

// //             "fullname email phone profileImage"

// //           )

// //           .populate(

// //             "doctorId",

// //             "name speciality fees image"

// //           )

// //           .sort({
// //             createdAt: -1,
// //           });





// //       res.status(200).json({

// //         success: true,

// //         count:
// //           appointments.length,

// //         data:
// //           appointments,

// //       });

// //     } catch (error) {

// //       console.log(
// //         "GET DOCTOR APPOINTMENTS ERROR =>",
// //         error
// //       );

// //       res.status(500).json({

// //         success: false,

// //         message:
// //           error.message,

// //       });

// //     }

// //   };
// exports.getDoctorAppointments =
//   async (req, res) => {

//     try {

//       const appointments =
//         await Appointment.find({

//           doctorId:
//             req.doctor._id,

//         })

//         // FULL USER DETAIL
//         .populate({

//           path: "userId",

//           select:
//             "_id fullname email phone gender age profileImage address",

//         })

//         // FULL DOCTOR DETAIL
//         .populate({

//           path: "doctorId",

//           select:
//             "_id name email phone speciality experience gender image clinicAddress fees",

//         })

//         .sort({

//           createdAt: -1,

//         });

//       res.status(200).json({

//         success: true,

//         count:
//           appointments.length,

//         data:
//           appointments,

//       });

//     } catch (error) {

//       console.log(error);

//       res.status(500).json({

//         success: false,

//         message:
//           error.message,

//       });

//     }

// };






// /* =========================
//    🔍 GET SINGLE APPOINTMENT
// ========================= */

// // exports.getAppointmentById =
// //   async (req, res) => {

// //     try {

// //       const appointment =
// //         await Appointment.findById(
// //           req.params.id
// //         )

// //           .populate(

// //             "doctorId",

// //             "name speciality fees image"

// //           )

// //           .populate(

// //             "userId",

// //             "fullname email phone profileImage"

// //           );





// //       if (!appointment) {

// //         return res.status(404).json({

// //           success: false,

// //           message:
// //             "Appointment not found",

// //         });

// //       }





// //       res.status(200).json({

// //         success: true,

// //         data:
// //           appointment,

// //       });

// //     } catch (error) {

// //       console.log(error);

// //       res.status(500).json({

// //         success: false,

// //         message:
// //           error.message,

// //       });

// //     }

// //   };
// exports.getAppointmentById =
//   async (req, res) => {

//     try {

//       const appointment =
//         await Appointment.findById(

//           req.params.id

//         )

//         // FULL DOCTOR DETAIL
//         .populate({

//           path: "doctorId",

//           select:
//             "_id name email phone speciality experience gender image clinicAddress fees",

//         })

//         // FULL USER DETAIL
//         .populate({

//           path: "userId",

//           select:
//             "_id fullname email phone gender age profileImage address",

//         });

//       if (!appointment) {

//         return res.status(404).json({

//           success: false,

//           message:
//             "Appointment not found",

//         });

//       }

//       res.status(200).json({

//         success: true,

//         data:
//           appointment,

//       });

//     } catch (error) {

//       console.log(error);

//       res.status(500).json({

//         success: false,

//         message:
//           error.message,

//       });

//     }

// };







// /* =========================
//    ❌ CANCEL APPOINTMENT
// ========================= */

// exports.cancelAppointment =
//   async (req, res) => {

//     try {

//       const appointment =
//         await Appointment.findById(
//           req.params.id
//         );





//       if (!appointment) {

//         return res.status(404).json({

//           success: false,

//           message:
//             "Appointment not found",

//         });

//       }





//       appointment.status =
//         "cancelled";





//       await appointment.save();





//       res.status(200).json({

//         success: true,

//         message:
//           "Appointment cancelled successfully",

//         data:
//           appointment,

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







// /* =========================
//    ✅ COMPLETE APPOINTMENT
// ========================= */

// exports.completeAppointment =
//   async (req, res) => {

//     try {

//       const appointment =
//         await Appointment.findById(
//           req.params.id
//         );





//       if (!appointment) {

//         return res.status(404).json({

//           success: false,

//           message:
//             "Appointment not found",

//         });

//       }





//       appointment.status =
//         "completed";





//       await appointment.save();





//       res.status(200).json({

//         success: true,

//         message:
//           "Appointment completed successfully",

//         data:
//           appointment,

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







// /* =========================
//    🩺 UPDATE VITALS
// ========================= */

// exports.updateVitals =
//   async (req, res) => {

//     try {

//       const {

//         bloodPressure,
//         weight,
//         temperature,

//       } = req.body;





//       const appointment =
//         await Appointment.findById(
//           req.params.id
//         );





//       if (!appointment) {

//         return res.status(404).json({

//           success: false,

//           message:
//             "Appointment not found",

//         });

//       }





//       appointment.bloodPressure =
//         bloodPressure ||
//         appointment.bloodPressure;

//       appointment.weight =
//         weight ||
//         appointment.weight;

//       appointment.temperature =
//         temperature ||
//         appointment.temperature;





//       await appointment.save();





//       res.status(200).json({

//         success: true,

//         message:
//           "Vitals updated successfully",

//         data:
//           appointment,

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


const crypto = require("crypto");

const Razorpay = require("razorpay");

const Appointment = require(
  "../models/appointmentModel"
);

const Doctor = require(
  "../models/doctorModel"
);

const PaymentSettlement =
  require(
    "../models/paymentSettlementModel"
  );


// LOAD USER MODEL
require("../models/userModel");





/* =====================================================
   🔥 RAZORPAY CONFIG
===================================================== */

const razorpay =
  new Razorpay({

    key_id:
      process.env.RAZORPAY_KEY_ID,

    key_secret:
      process.env.RAZORPAY_KEY_SECRET,
  });





/* =====================================================
   📅 CREATE APPOINTMENT ORDER
===================================================== */

exports.bookAppointment =
  async (req, res) => {

    try {

      const {

        doctorId,

        patientName,
        age,
        gender,
        reason,

        date,
        time,
        type,

        latitude,
        longitude,

        bloodPressure,
        weight,
        temperature,

      } = req.body;





      /* ==========================================
         VALIDATION
      ========================================== */

      if (

        !doctorId ||
        !patientName ||
        !age ||
        !gender ||
        !date ||
        !time ||
        !type

      ) {

        return res.status(400).json({

          success: false,

          message:
            "All fields are required",
        });

      }





      /* ==========================================
         CHECK DOCTOR
      ========================================== */

      const doctor =
        await Doctor.findById(
          doctorId
        );

      if (!doctor) {

        return res.status(404).json({

          success: false,

          message:
            "Doctor not found",
        });

      }





      /* ==========================================
         CHECK SLOT
      ========================================== */

      const existingAppointment =
        await Appointment.findOne({

          doctorId,
          date,
          time,

          status: {
            $ne: "cancelled",
          },
        });

      if (existingAppointment) {

        return res.status(400).json({

          success: false,

          message:
            "Slot already booked",
        });

      }





      /* ==========================================
         GENERATE TOKEN
      ========================================== */

      const totalAppointments =
        await Appointment.countDocuments({

          doctorId,
          date,
        });

      const token =
        totalAppointments + 1;





      /* ==========================================
         CREATE RAZORPAY ORDER
      ========================================== */

      const razorpayOrder =
        await razorpay.orders.create({

          amount:
            doctor.fees * 100,

          currency: "INR",

          receipt:
            `appointment_${Date.now()}`,
        });





      /* ==========================================
         COMMISSION CALCULATION
      ========================================== */

      // const adminCommission =
      //   doctor.fees * 0.20;

      // const doctorAmount =
      //   doctor.fees -
      //   adminCommission;





      /* ==========================================
         CREATE APPOINTMENT
      ========================================== */

      const appointment =
        await Appointment.create({

          userId:
            req.user._id,

          doctorId,

          patientName,
          age,
          gender,
          reason,

          token,

          date,
          time,
          type,

          latitude,
          longitude,

          bloodPressure,
          weight,
          temperature,

          // STATUS
          status:
            "pending",

          // PAYMENT
          paymentMethod:
            "ONLINE",

          paymentStatus:
            "PENDING",

          settlementStatus:
            "PENDING",

        
appointmentFees:
  doctor.fees,

adminCommission:
  0,

doctorAmount:
  doctor.fees,



          // RAZORPAY
          razorpayOrderId:
            razorpayOrder.id,
        });





      /* ==========================================
         RESPONSE
      ========================================== */

      res.status(201).json({

        success: true,

        message:
          "Appointment Order Created",

        appointment,

        razorpayOrder,
      });

    } catch (error) {

      console.log(
        "BOOK APPOINTMENT ERROR =>",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,
      });

    }

  };











exports.verifyAppointmentPayment =
  async (req, res) => {

    try {

      const {

        appointmentId,

        razorpay_order_id,

        razorpay_payment_id,

        razorpay_signature,

      } = req.body;



      // ==========================================
      // VERIFY PAYMENT SIGNATURE
      // ==========================================

      const body =
        razorpay_order_id +
        "|" +
        razorpay_payment_id;



      const expectedSignature =
        crypto

          .createHmac(

            "sha256",

            process.env
              .RAZORPAY_KEY_SECRET

          )

          .update(body.toString())

          .digest("hex");



      const isAuthentic =
        expectedSignature ===
        razorpay_signature;



      // INVALID SIGNATURE
      if (!isAuthentic) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid Payment Signature",
        });

      }



      // ==========================================
      // FIND APPOINTMENT
      // ==========================================

      const appointment =
        await Appointment.findById(
          appointmentId
        );



      // APPOINTMENT NOT FOUND
      if (!appointment) {

        return res.status(404).json({

          success: false,

          message:
            "Appointment not found",
        });

      }



      // ==========================================
      // PAYMENT ALREADY VERIFIED
      // ==========================================

      if (

        appointment.paymentStatus ===
        "PAID"

      ) {

        return res.status(400).json({

          success: false,

          message:
            "Payment already verified",
        });

      }



      // ==========================================
      // UPDATE APPOINTMENT
      // ==========================================

      appointment.paymentStatus =
        "PAID";

      appointment.status =
        "approved";

      appointment.razorpayPaymentId =
        razorpay_payment_id;

      appointment.razorpaySignature =
        razorpay_signature;

      appointment.paidAt =
        new Date();



      await appointment.save();




      // ==========================================
      // CHECK EXISTING SETTLEMENT
      // ==========================================

      const existingSettlement =
        await PaymentSettlement.findOne({

          sourceId:
            appointment._id,

          sourceType:
            "APPOINTMENT",
        });




      // ==========================================
      // CREATE SETTLEMENT
      // ==========================================

      if (!existingSettlement) {

        await PaymentSettlement.create({

          // USER
          userId:
            appointment.userId,



          // RECEIVER
          receiverId:
            appointment.doctorId,

          receiverType:
            "DOCTOR",



          // SOURCE
          sourceType:
            "APPOINTMENT",

          sourceId:
            appointment._id,



          // PAYMENT
          totalAmount:
            appointment.appointmentFees,

          adminCommission:
            appointment.adminCommission,

          receiverAmount:
            appointment.doctorAmount,



          // STATUS
          settlementStatus:
            "PENDING",



          // RAZORPAY
          razorpayOrderId:
            razorpay_order_id,

          razorpayPaymentId:
            razorpay_payment_id,
        });

      }




      // ==========================================
      // RESPONSE
      // ==========================================

      res.status(200).json({

        success: true,

        message:
          "Payment Verified Successfully",

        appointment,
      });

    } catch (error) {

      console.log(
        "VERIFY APPOINTMENT PAYMENT ERROR =>",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,
      });

    }

  };






/* =====================================================
   📄 GET MY APPOINTMENTS
===================================================== */

exports.getMyAppointments =
  async (req, res) => {

    try {

      const appointments =
        await Appointment.find({

          userId:
            req.user._id,
        })

        .populate({

          path: "doctorId",

          select:
            "_id name email phone speciality experience gender image clinicAddress fees",
        })

        .populate({

          path: "userId",

          select:
            "_id fullname email phone gender age profileImage address",
        })

        .sort({

          createdAt: -1,
        });

      res.status(200).json({

        success: true,

        count:
          appointments.length,

        data:
          appointments,
      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,
      });

    }

  };







/* =====================================================
   👨‍⚕️ GET DOCTOR APPOINTMENTS
===================================================== */

exports.getDoctorAppointments =
  async (req, res) => {

    try {

      const appointments =
        await Appointment.find({

          doctorId:
            req.doctor._id,
        })

        .populate({

          path: "userId",

          select:
            "_id fullname email phone gender age profileImage address",
        })

        .populate({

          path: "doctorId",

          select:
            "_id name email phone speciality experience gender image clinicAddress fees",
        })

        .sort({

          createdAt: -1,
        });

      res.status(200).json({

        success: true,

        count:
          appointments.length,

        data:
          appointments,
      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,
      });

    }

  };







/* =====================================================
   🔍 GET SINGLE APPOINTMENT
===================================================== */

exports.getAppointmentById =
  async (req, res) => {

    try {

      const appointment =
        await Appointment.findById(
          req.params.id
        )

        .populate({

          path: "doctorId",

          select:
            "_id name email phone speciality experience gender image clinicAddress fees",
        })

        .populate({

          path: "userId",

          select:
            "_id fullname email phone gender age profileImage address",
        });

      if (!appointment) {

        return res.status(404).json({

          success: false,

          message:
            "Appointment not found",
        });

      }

      res.status(200).json({

        success: true,

        data:
          appointment,
      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,
      });

    }

  };







/* =====================================================
   ❌ CANCEL APPOINTMENT
===================================================== */

exports.cancelAppointment =
  async (req, res) => {

    try {

      const appointment =
        await Appointment.findById(
          req.params.id
        );

      if (!appointment) {

        return res.status(404).json({

          success: false,

          message:
            "Appointment not found",
        });

      }

      appointment.status =
        "cancelled";

      await appointment.save();

      res.status(200).json({

        success: true,

        message:
          "Appointment cancelled successfully",

        data:
          appointment,
      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,
      });

    }

  };







/* =====================================================
   ✅ COMPLETE APPOINTMENT
===================================================== */

exports.completeAppointment =
  async (req, res) => {

    try {

      const appointment =
        await Appointment.findById(
          req.params.id
        );

      if (!appointment) {

        return res.status(404).json({

          success: false,

          message:
            "Appointment not found",
        });

      }

      appointment.status =
        "completed";

      await appointment.save();

      res.status(200).json({

        success: true,

        message:
          "Appointment completed successfully",

        data:
          appointment,
      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,
      });

    }

  };







/* =====================================================
   🩺 UPDATE VITALS
===================================================== */

exports.updateVitals =
  async (req, res) => {

    try {

      const {

        bloodPressure,
        weight,
        temperature,

      } = req.body;

      const appointment =
        await Appointment.findById(
          req.params.id
        );

      if (!appointment) {

        return res.status(404).json({

          success: false,

          message:
            "Appointment not found",
        });

      }

      appointment.bloodPressure =
        bloodPressure ||
        appointment.bloodPressure;

      appointment.weight =
        weight ||
        appointment.weight;

      appointment.temperature =
        temperature ||
        appointment.temperature;

      await appointment.save();

      res.status(200).json({

        success: true,

        message:
          "Vitals updated successfully",

        data:
          appointment,
      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,
      });

    }

  };

exports.getDoctorEarnings =
  async (req, res) => {

    try {

      const earnings =
        await PaymentSettlement.find({

          receiverId:
            req.doctor._id,

          receiverType:
            "DOCTOR",
        })

        .sort({
          createdAt: -1,
        });




      // ==========================================
      // TOTAL EARNING
      // ==========================================

      const totalEarning =
        earnings.reduce(

          (acc, item) =>

            acc +
            item.receiverAmount,

          0
        );




      // ==========================================
      // PENDING
      // ==========================================

      const pendingAmount =
        earnings

          .filter(

            (item) =>

              item.settlementStatus ===
              "PENDING"

          )

          .reduce(

            (acc, item) =>

              acc +
              item.receiverAmount,

            0
          );




      // ==========================================
      // SETTLED
      // ==========================================

      const settledAmount =
        earnings

          .filter(

            (item) =>

              item.settlementStatus ===
              "SETTLED"

          )

          .reduce(

            (acc, item) =>

              acc +
              item.receiverAmount,

            0
          );




      // ==========================================
      // RESPONSE
      // ==========================================

      res.status(200).json({

        success: true,

        summary: {

          totalEarning,

          pendingAmount,

          settledAmount,
        },

        count:
          earnings.length,

        data:
          earnings,
      });

    } catch (error) {

      console.log(
        "GET DOCTOR EARNINGS ERROR =>",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,
      });

    }

  };


exports.settleDoctorPayment =
  async (req, res) => {

    try {

      const PaymentSettlement =
        require(
          "../models/paymentSettlementModel"
        );



      // ==========================================
      // FIND SETTLEMENT
      // ==========================================

      const settlement =
        await PaymentSettlement.findById(
          req.params.id
        );



      // NOT FOUND
      if (!settlement) {

        return res.status(404).json({

          success: false,

          message:
            "Settlement not found",
        });

      }



      // ==========================================
      // ALREADY SETTLED
      // ==========================================

      if (

        settlement.settlementStatus ===
        "SETTLED"

      ) {

        return res.status(400).json({

          success: false,

          message:
            "Payment already settled",
        });

      }



      // ==========================================
      // UPDATE SETTLEMENT
      // ==========================================

      settlement.settlementStatus =
        "SETTLED";

      settlement.settledAt =
        new Date();



      await settlement.save();




      // ==========================================
      // UPDATE APPOINTMENT
      // ==========================================

      await Appointment.findByIdAndUpdate(

        settlement.sourceId,

        {

          settlementStatus:
            "SETTLED",
        }
      );




      // ==========================================
      // RESPONSE
      // ==========================================

      res.status(200).json({

        success: true,

        message:
          "Doctor payment settled successfully",

        settlement,
      });

    } catch (error) {

      console.log(
        "SETTLE PAYMENT ERROR =>",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,
      });

    }

  };


