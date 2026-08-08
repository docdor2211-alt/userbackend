


const crypto =
  require("crypto");

const razorpay =
  require(
    "../utils/razorpay"
  );

const Payment =
  require(
    "../models/PaymentModel"
  );

const axios =
  require("axios");

const Appointment =
  require(
    "../models/appointmentModel"
  );





// ======================================================
// CREATE ORDER
// ======================================================

exports.createOrder =
  async (req, res) => {

    try {

      const { amount } =
        req.body;



      // ================= RAZORPAY ORDER =================

      const options = {

        amount:
          Number(amount) * 100,

        currency: "INR",

        receipt:
          `receipt_${Date.now()}`,

      };



      const order =
        await razorpay.orders.create(
          options
        );



      res.status(200).json({

        success: true,

        message:
          "Order created successfully",

        order,

      });

    } catch (error) {

      console.log(
        "CREATE ORDER ERROR:",
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
// VERIFY PAYMENT
// ======================================================

// exports.verifyPayment =
//   async (req, res) => {

//     try {

//       const {

//         razorpay_order_id,

//         razorpay_payment_id,

//         razorpay_signature,

//         amount,

//         appointmentId,

//       } = req.body;



//       // ================= VERIFY SIGNATURE =================

//       const body =
//         razorpay_order_id +
//         "|" +
//         razorpay_payment_id;



//       const expectedSignature =
//         crypto

//           .createHmac(

//             "sha256",

//             process.env
//               .RAZORPAY_KEY_SECRET

//           )

//           .update(
//             body.toString()
//           )

//           .digest("hex");



//       const isAuthentic =

//         expectedSignature ===
//         razorpay_signature;



//       // ================= INVALID SIGNATURE =================

//       if (!isAuthentic) {

//         return res.status(400).json({

//           success: false,

//           message:
//             "Invalid payment signature",

//         });

//       }



//       // ================= SAVE PAYMENT =================

//       const payment =
//         await Payment.create({

//           userId:
//             req.user._id,

//           appointmentId,

//           razorpay_order_id,

//           razorpay_payment_id,

//           razorpay_signature,

//           amount,

//           paymentStatus:
//             "paid",

//         });



//       res.status(200).json({

//         success: true,

//         message:
//           "Payment verified successfully",

//         data: payment,

//       });

//     } catch (error) {

//       console.log(
//         "VERIFY PAYMENT ERROR:",
//         error
//       );

//       res.status(500).json({

//         success: false,

//         message:
//           error.message,

//       });

//     }

//   };

exports.verifyPayment =
  async (req, res) => {

    try {

      const {

        razorpay_order_id,

        razorpay_payment_id,

        razorpay_signature,

        amount,

        appointmentId,

      } = req.body;



      // ================= VERIFY SIGNATURE =================

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

          .update(
            body.toString()
          )

          .digest("hex");



      const isAuthentic =

        expectedSignature ===
        razorpay_signature;



      // ================= INVALID SIGNATURE =================

      if (!isAuthentic) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid Signature",

        });

      }



      // ================= DEBUG =================

      console.log(
        "REQ USER:",
        req.user
      );



      // ================= SAVE PAYMENT =================

      const payment =
        await Payment.create({

          userId:
            req.user._id,

          appointmentId:
            appointmentId || null,

          razorpay_order_id,

          razorpay_payment_id,

          razorpay_signature,

          amount:
            Number(amount),

          paymentStatus:
            "paid",

        });



      console.log(
        "PAYMENT SAVED:",
        payment
      );



      res.status(200).json({

        success: true,

        message:
          "Payment Verified Successfully",

        data: payment,

      });

    } catch (error) {

      console.log(
        "VERIFY PAYMENT ERROR:",
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
// USER MY PAYMENTS
// ======================================================

exports.getMyPayments =
  async (req, res) => {

    try {

      // ================= AUTH CHECK =================

      if (!req.user?._id) {

        return res.status(401).json({

          success: false,

          message:
            "User not authenticated",

        });

      }



      // ================= FIND USER PAYMENTS =================

      const payments =
        await Payment.find({

          userId:
            req.user._id,

        })

          .populate({

            path: "userId",

            select:
              "fullname email phone",

          })

          .populate({

            path:
              "appointmentId",

          })

          .sort({
            createdAt: -1,
          });



      // ================= TOTAL AMOUNT =================

      const totalAmount =
        payments.reduce(

          (acc, item) =>

            acc +
            Number(
              item.amount || 0
            ),

          0

        );



      // ================= RESPONSE =================

      res.status(200).json({

        success: true,

        message:
          "My payments fetched successfully",

        totalPayments:
          payments.length,

        totalAmount,

        data: payments,

      });

    } catch (error) {

      console.log(
        "GET MY PAYMENTS ERROR:",
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
// ADMIN - ALL PAYMENTS
// ======================================================

exports.getAllPayments =
  async (req, res) => {

    try {

      // ================= FIND ALL PAYMENTS =================

      const payments =
        await Payment.find()

          .populate({

            path: "userId",

            select:
              "fullname email phone",

          })

          .populate({

            path:
              "appointmentId",

          })

          .sort({
            createdAt: -1,
          });



      // ================= TOTAL PAYMENTS =================

      const totalPayments =
        payments.length;



      // ================= TOTAL AMOUNT =================

      const totalAmount =
        payments.reduce(

          (acc, item) =>

            acc +
            Number(
              item.amount || 0
            ),

          0

        );



      // ================= RESPONSE =================

      res.status(200).json({

        success: true,

        message:
          "All payments fetched successfully",

        totalPayments,

        totalAmount,

        data: payments,

      });

    } catch (error) {

      console.log(
        "GET ALL PAYMENTS ERROR:",
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
// ADMIN SETTLE DOCTOR PAYMENT
// ======================================================

exports.settleDoctorPayment =
  async (req, res) => {

    try {

      const {

        appointmentId,

        adminCommission,

      } = req.body;



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
      // PAYMENT NOT COMPLETED
      // ==========================================

      if (

        appointment.paymentStatus !==
        "PAID"

      ) {

        return res.status(400).json({

          success: false,

          message:
            "Payment not completed",
        });

      }



      // ==========================================
      // ALREADY SETTLED
      // ==========================================

      if (

        appointment.settlementStatus ===
        "SETTLED"

      ) {

        return res.status(400).json({

          success: false,

          message:
            "Payment already settled",
        });

      }



      // ==========================================
      // CALCULATE
      // ==========================================

      const doctorAmount =

        appointment.appointmentFees -
        adminCommission;




      // ==========================================
      // UPDATE ADMIN DB
      // ==========================================

      appointment.adminCommission =

        adminCommission;

      appointment.doctorAmount =

        doctorAmount;

      appointment.settlementStatus =

        "SETTLED";



      await appointment.save();




      // ==========================================
      // HIT DOCTOR BACKEND
      // ==========================================

      await axios.put(

        `http://localhost:7001/api/appointments/settle-payment/${appointmentId}`,

        {

          adminCommission,

          doctorAmount,
        }
      );




      // ==========================================
      // RESPONSE
      // ==========================================

      res.status(200).json({

        success: true,

        message:
          "Doctor payment settled successfully",

        data:
          appointment,
      });

    } catch (error) {

      console.log(

        "SETTLEMENT ERROR =>",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,
      });

    }

  };

