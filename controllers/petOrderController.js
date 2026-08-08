// controllers/petOrderController.js

const crypto = require("crypto");

const Razorpay = require("razorpay");

const PetOrder = require(
  "../models/petOrderModel"
);

const razorpay = new Razorpay({

  key_id: process.env.RAZORPAY_KEY_ID,

  key_secret: process.env.RAZORPAY_KEY_SECRET,

});



// ======================================================
// CREATE PET ORDER
// ======================================================

exports.createPetOrder = async (req, res) => {

  try {

   const {

  petName,

  petType,

  items,

  totalAmount,

  paymentMethod,

  deliveryAddress,

  pharmacyId,

} = req.body;


    const user = req.user._id;


    // =====================================
    // COD ORDER
    // =====================================

    if (paymentMethod === "COD") {

 const order = await PetOrder.create({

  user,

  pharmacyId,

  petName,

  petType,

  items,

  totalAmount,

  paymentMethod,

  deliveryAddress,

});

      return res.status(201).json({

        success: true,

        message: "Pet Order Placed",

        order,

      });

    }


    // =====================================
    // ONLINE PAYMENT
    // =====================================

    const razorpayOrder =
      await razorpay.orders.create({

        amount: totalAmount * 100,

        currency: "INR",

        receipt: `receipt_${Date.now()}`,

      });


const order = await PetOrder.create({

  user,

  pharmacyId,

  petName,

  petType,

  items,

  totalAmount,

  paymentMethod: "ONLINE",

  deliveryAddress,

  razorpayOrderId:
    razorpayOrder.id,

  paymentStatus:
    "PENDING",

});


    res.status(201).json({

      success: true,

      message: "Razorpay Order Created",

      order,

      razorpayOrder,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};



// ======================================================
// VERIFY PAYMENT
// ======================================================

exports.verifyPetPayment = async (req, res) => {

  try {

    const {

      orderId,

      razorpay_order_id,

      razorpay_payment_id,

      razorpay_signature,

    } = req.body;


    const body =
      razorpay_order_id +
      "|" +
      razorpay_payment_id;


    const expectedSignature = crypto

      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )

      .update(body.toString())

      .digest("hex");


    const isAuthentic =
      expectedSignature === razorpay_signature;


    if (!isAuthentic) {

      return res.status(400).json({

        success: false,

        message: "Invalid Signature",

      });

    }


    const order =
      await PetOrder.findByIdAndUpdate(

        orderId,

        {

          razorpayPaymentId:
            razorpay_payment_id,

          razorpaySignature:
            razorpay_signature,

          paymentStatus: "PAID",

          orderStatus: "CONFIRMED",

        },

        { new: true }

      );


    res.status(200).json({

      success: true,

      message: "Payment Verified",

      order,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};



// ======================================================
// GET MY ORDERS
// ======================================================

exports.getMyPetOrders = async (req, res) => {

  try {

    const orders =
      await PetOrder.find({

        user: req.user._id,

      })

      .sort({ createdAt: -1 });


    res.status(200).json({

      success: true,

      count: orders.length,

      data: orders,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};



// ======================================================
// ADMIN - GET ALL ORDERS
// ======================================================

exports.getAllPetOrders = async (req, res) => {

  try {

    const orders =
      await PetOrder.find()

      .sort({ createdAt: -1 });


    res.status(200).json({

      success: true,

      count: orders.length,

      data: orders,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};