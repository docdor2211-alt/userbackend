// controllers/labBookingController.js

const crypto = require("crypto");

const Razorpay = require("razorpay");

const LabBooking = require(
  "../models/labBookingModel"
);

// IMPORT USER MODEL
require("../models/userModel");

const razorpay = new Razorpay({

  key_id: process.env.RAZORPAY_KEY_ID,

  key_secret:
    process.env.RAZORPAY_KEY_SECRET,

});


// ======================================================
// CREATE LAB BOOKING
// ======================================================

exports.createLabBooking =
  async (req, res) => {

    try {

      const {

        testName,

        price,

        sampleCollectionType,

        scheduledDate,

        paymentMethod,

      } = req.body;

      const user =
        req.user._id;


      // =====================================
      // COD BOOKING
      // =====================================

      if (
        paymentMethod === "COD"
      ) {

        const booking =
          await LabBooking.create({

            user,

            testName,

            price,

            sampleCollectionType,

            scheduledDate,

            paymentMethod,

          });

        return res.status(201).json({

          success: true,

          message:
            "Lab Booking Created",

          booking,

        });

      }


      // =====================================
      // ONLINE PAYMENT
      // =====================================

      const razorpayOrder =
        await razorpay.orders.create({

          amount: price * 100,

          currency: "INR",

          receipt:
            `receipt_${Date.now()}`,

        });


      const booking =
        await LabBooking.create({

          user,

          testName,

          price,

          sampleCollectionType,

          scheduledDate,

          paymentMethod:
            "ONLINE",

          razorpayOrderId:
            razorpayOrder.id,

          paymentStatus:
            "PENDING",

        });


      res.status(201).json({

        success: true,

        message:
          "Razorpay Order Created",

        booking,

        razorpayOrder,

      });

    } catch (error) {

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

exports.verifyLabPayment =
  async (req, res) => {

    try {

      const {

        bookingId,

        razorpay_order_id,

        razorpay_payment_id,

        razorpay_signature,

      } = req.body;


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


      if (!isAuthentic) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid Signature",

        });

      }


      const booking =
        await LabBooking.findByIdAndUpdate(

          bookingId,

          {

            razorpayPaymentId:
              razorpay_payment_id,

            razorpaySignature:
              razorpay_signature,

            paymentStatus:
              "PAID",

            status:
              "Confirmed",

          },

          { new: true }

        );


      res.status(200).json({

        success: true,

        message:
          "Payment Verified",

        booking,

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

};


// ======================================================
// GET MY BOOKINGS
// ======================================================

exports.getMyLabBookings =
  async (req, res) => {

    try {

      const bookings =
        await LabBooking.find({

          user: req.user._id,

        })

        .populate(

          "user",

          "fullname email phone role"

        )

        .sort({
          createdAt: -1,
        });


      res.status(200).json({

        success: true,

        count:
          bookings.length,

        data: bookings,

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

};


// ======================================================
// GET ALL BOOKINGS
// ======================================================

// exports.getAllLabBookings =
//   async (req, res) => {

//     try {

//       const bookings =
//         await LabBooking.find()

//           .populate(

//             "user",

//             "fullname email phone role"

//           )

//           .sort({
//             createdAt: -1,
//           });


//       res.status(200).json({

//         success: true,

//         count:
//           bookings.length,

//         data: bookings,

//       });

//     } catch (error) {

//       res.status(500).json({

//         success: false,

//         message:
//           error.message,

//       });

//     }

// };

exports.getAllLabBookings =
  async (req, res) => {

    try {

      const bookings =
        await LabBooking.find()

          .populate({
            path: "user",

            select:
              "fullname email phone role",
          })

          .sort({
            createdAt: -1,
          });

      res.status(200).json({

        success: true,

        count:
          bookings.length,

        data: bookings,

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

};