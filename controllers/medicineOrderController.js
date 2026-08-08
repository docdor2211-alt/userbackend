// // controllers/medicineOrderController.js

// const crypto = require("crypto");
// const Razorpay = require("razorpay");

// const MedicineOrder = require("../models/medicineOrderModel");
// const {
//   debitWallet,
//   creditWallet,
// } = require("../services/walletService");

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });


// // ==========================================
// // CREATE ORDER
// // ==========================================

// exports.createMedicineOrder = async (req, res) => {
//   try {
//     const {
//       user,
//       items,
//       totalAmount,
//       paymentMethod,
//       getMyMedicineOrders,
//       deliveryAddress,
//     } = req.body;

//     // COD ORDER
//     if (paymentMethod === "COD") {

//    const order = await MedicineOrder.create({
//   user: req.user._id,
//         items,
//         totalAmount,
//         paymentMethod,
//         deliveryAddress,
//         paymentStatus: "PENDING",
//       });

//       return res.status(201).json({
//         success: true,
//         message: "COD Order Placed",
//         order,
//       });
//     }// ==========================================
// // WALLET PAYMENT
// // ==========================================

// if (paymentMethod === "WALLET") {

//   // USER WALLET SE MONEY CUT

//   await debitWallet({

//     userId: req.user._id,

//     amount: totalAmount,

//     title: "Medicine Order Payment",

//     subtitle: "Medicine Purchase",
//   });


//   // ADMIN WALLET ME MONEY ADD

//   await creditWallet({

//     userId: process.env.ADMIN_ID,

//     amount: totalAmount,

//     title: "Medicine Order Received",

//     subtitle: "Medicine Purchase",
//   });


//   // ORDER CREATE

//   const order = await MedicineOrder.create({

//     user: req.user._id,

//     items,

//     totalAmount,

//     paymentMethod: "WALLET",

//     deliveryAddress,

//     paymentStatus: "PAID",

//     orderStatus: "CONFIRMED",
//   });


//   return res.status(201).json({

//     success: true,

//     message: "Wallet Payment Successful",

//     order,
//   });
// }

//     // ONLINE PAYMENT ORDER

//     const razorpayOrder = await razorpay.orders.create({
//       amount: totalAmount * 100,
//       currency: "INR",
//       receipt: `receipt_${Date.now()}`,
//     });

//     const order = await MedicineOrder.create({
//   user: req.user._id,
//       items,
//       totalAmount,
//       paymentMethod: "ONLINE",
//       deliveryAddress,

//       razorpayOrderId: razorpayOrder.id,

//       paymentStatus: "PENDING",
//     });

//     res.status(201).json({
//       success: true,
//       message: "Razorpay Order Created",
//       order,
//       razorpayOrder,
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


// // ==========================================
// // VERIFY PAYMENT
// // ==========================================

// exports.verifyMedicinePayment = async (req, res) => {
//   try {

//     const {
//       orderId,
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//     } = req.body;

//     const body =
//       razorpay_order_id + "|" + razorpay_payment_id;

//     const expectedSignature = crypto
//       .createHmac(
//         "sha256",
//         process.env.RAZORPAY_KEY_SECRET
//       )
//       .update(body.toString())
//       .digest("hex");

//     const isAuthentic =
//       expectedSignature === razorpay_signature;

//     if (!isAuthentic) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid Payment Signature",
//       });
//     }

//     const order = await MedicineOrder.findByIdAndUpdate(
//       orderId,
//       {
//         razorpayPaymentId: razorpay_payment_id,
//         razorpaySignature: razorpay_signature,

//         paymentStatus: "PAID",

//         orderStatus: "CONFIRMED",

//         paidAt: new Date(),
//       },
//       { new: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Payment Verified Successfully",
//       order,
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


// // ==========================================
// // GET ALL ORDERS
// // ==========================================

// exports.getAllMedicineOrders = async (req, res) => {
//   try {

//     const orders = await MedicineOrder.find()
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       count: orders.length,
//       data: orders,
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


// // ==========================================
// // GET SINGLE ORDER
// // ==========================================

// exports.getSingleMedicineOrder = async (req, res) => {
//   try {

//     const order = await MedicineOrder.findById(
//       req.params.id
//     );

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: order,
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
// // ==========================================
// // GET MY ORDERS
// // ==========================================

// exports.getMyMedicineOrders = async (req, res) => {

//   try {

//     const orders = await MedicineOrder.find({
//       user: req.user._id,
//     })

//     .sort({ createdAt: -1 });

//     res.status(200).json({

//       success: true,

//       count: orders.length,

//       data: orders,

//     });

//   } catch (error) {

//     res.status(500).json({

//       success: false,

//       message: error.message,

//     });

//   }

// };
// exports.updateMedicineOrderStatus =
//   async (req, res) => {

//     try {

//       const { status } =
//         req.body;

//       // VALID STATUS
//       const validStatus = [

//         "PENDING",

//         "CONFIRMED",

//         "OUT_FOR_DELIVERY",

//         "DELIVERED",

//         "CANCELLED",

//       ];

//       if (
//         !validStatus.includes(
//           status
//         )
//       ) {

//         return res.status(400).json({

//           success: false,

//           message:
//             "Invalid order status",

//         });

//       }

//       // FIND ORDER
//       const order =
//         await MedicineOrder.findById(
//           req.params.id
//         );

//       if (!order) {

//         return res.status(404).json({

//           success: false,

//           message:
//             "Order not found",

//         });

//       }

//       // UPDATE STATUS
//       order.orderStatus =
//         status;

//       await order.save();

//       res.status(200).json({

//         success: true,

//         message:
//           "Order status updated successfully",

//         data: order,

//       });

//     } catch (error) {

//       res.status(500).json({

//         success: false,

//         message:
//           error.message,

//       });

//     }

//   };


// controllers/medicineOrderController.js

const crypto = require("crypto");
const Razorpay = require("razorpay");
const MedicineOrder = require("../models/medicineOrderModel");

const {
  debitWallet,
  creditWallet,
} = require("../services/walletService");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ==========================================
// CREATE MEDICINE ORDER
// ==========================================

exports.createMedicineOrder = async (req, res) => {
  try {
    const {
      items,
      totalAmount,
      paymentMethod,
      deliveryAddress,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items are required",
      });
    }

    if (!deliveryAddress) {
      return res.status(400).json({
        success: false,
        message: "Delivery address is required",
      });
    }

    // ==========================================
    // COD ORDER
    // ==========================================

    if (paymentMethod === "COD") {
      const order = await MedicineOrder.create({
        user: req.user._id,
        items,
        totalAmount,
        paymentMethod: "COD",
        paymentStatus: "PENDING",

        deliveryAddress,

        orderStatus: "PLACED",

        pharmacyStatus: "Pending",

        deliveryStatus: "Pending",
      });

      return res.status(201).json({
        success: true,
        message: "COD Order Placed Successfully",
        data: order,
      });
    }

    // ==========================================
    // WALLET ORDER
    // ==========================================

    if (paymentMethod === "WALLET") {

      await debitWallet({

        userId: req.user._id,

        amount: totalAmount,

        title: "Medicine Order",

        subtitle: "Wallet Payment",
      });

      await creditWallet({

        userId: process.env.ADMIN_ID,

        amount: totalAmount,

        title: "Medicine Sale",

        subtitle: "Wallet Received",
      });

      const order = await MedicineOrder.create({

        user: req.user._id,

        items,

        totalAmount,

        paymentMethod: "WALLET",

        paymentStatus: "PAID",

        deliveryAddress,

        orderStatus: "CONFIRMED",

        pharmacyStatus: "Accepted",

        deliveryStatus: "Pending",

        acceptedAt: new Date(),

        paidAt: new Date(),
      });

      return res.status(201).json({

        success: true,

        message: "Wallet Payment Successful",

        data: order,
      });
    }

    // ==========================================
    // ONLINE PAYMENT
    // ==========================================

    const razorpayOrder =
      await razorpay.orders.create({

        amount: totalAmount * 100,

        currency: "INR",

        receipt: `MED-${Date.now()}`,
      });

    const order =
      await MedicineOrder.create({

        user: req.user._id,

        items,

        totalAmount,

        paymentMethod: "ONLINE",

        paymentStatus: "PENDING",

        deliveryAddress,

        razorpayOrderId:
          razorpayOrder.id,

        orderStatus: "PLACED",

        pharmacyStatus: "Pending",

        deliveryStatus: "Pending",
      });

    return res.status(201).json({

      success: true,

      message: "Razorpay Order Created",

      data: order,

      razorpayOrder,
    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message,
    });

  }

};

// ==========================================
// VERIFY PAYMENT
// ==========================================

exports.verifyMedicinePayment = async (req, res) => {

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

    const expected =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_KEY_SECRET
        )
        .update(body)
        .digest("hex");

    if (
      expected !==
      razorpay_signature
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Invalid Payment Signature",
      });

    }

    const order =
      await MedicineOrder.findByIdAndUpdate(

        orderId,

        {

          razorpayPaymentId:
            razorpay_payment_id,

          razorpaySignature:
            razorpay_signature,

          paymentStatus:
            "PAID",

          orderStatus:
            "CONFIRMED",

          pharmacyStatus:
            "Accepted",

          acceptedAt:
            new Date(),

          paidAt:
            new Date(),
        },

        {

          new: true,
        }

      );

    return res.status(200).json({

      success: true,

      message:
        "Payment Verified Successfully",

      data: order,
    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message:
        error.message,
    });

  }

};// ==========================================
// GET ALL MEDICINE ORDERS (ADMIN)
// ==========================================

exports.getAllMedicineOrders = async (req, res) => {
  try {

    const orders = await MedicineOrder.find()

      .populate("user", "name email phone")

      .populate("rider", "name phone")

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

// ==========================================
// GET MY ORDERS (USER)
// ==========================================

exports.getMyMedicineOrders = async (req, res) => {

  try {

    const orders = await MedicineOrder.find({

      user: req.user._id,

    })

      .populate("rider", "name phone")

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

// ==========================================
// GET SINGLE ORDER
// ==========================================

exports.getSingleMedicineOrder = async (req, res) => {

  try {

    const order = await MedicineOrder.findById(req.params.id)

      .populate("user", "name email phone")

      .populate("rider", "name phone");

    if (!order) {

      return res.status(404).json({

        success: false,

        message: "Order not found",

      });

    }

    res.status(200).json({

      success: true,

      data: order,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

// ==========================================
// UPDATE ORDER STATUS
// ==========================================

exports.updateMedicineOrderStatus = async (req, res) => {

  try {

    const { status } = req.body;

    const validStatus = [

      "CONFIRMED",

      "PACKED",

      "CANCELLED",

      "PICKED_UP",

      "OUT_FOR_DELIVERY",

      "DELIVERED",

    ];

    if (!validStatus.includes(status)) {

      return res.status(400).json({

        success: false,

        message: "Invalid Order Status",

      });

    }

    const order = await MedicineOrder.findById(req.params.id);

    if (!order) {

      return res.status(404).json({

        success: false,

        message: "Order not found",

      });

    }

    // ======================================
    // STATUS UPDATE
    // ======================================

    order.orderStatus = status;

    switch (status) {

      case "CONFIRMED":

        order.pharmacyStatus = "Accepted";

        order.acceptedAt = new Date();

        break;

      case "PACKED":

        order.packedAt = new Date();

        break;

      case "PICKED_UP":

        order.deliveryStatus = "Picked Up";

        order.pickedUpAt = new Date();

        break;

      case "OUT_FOR_DELIVERY":

        order.deliveryStatus = "Out For Delivery";

        order.outForDeliveryAt = new Date();

        break;

      case "DELIVERED":

        order.deliveryStatus = "Delivered";

        order.deliveredAt = new Date();

        order.isCompleted = true;

        break;

      case "CANCELLED":

        order.pharmacyStatus = "Rejected";

        order.cancelledAt = new Date();

        break;

    }

    await order.save();

    res.status(200).json({

      success: true,

      message: "Order Status Updated Successfully",

      data: order,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};// ==========================================
// ASSIGN RIDER
// ==========================================

exports.assignRider = async (req, res) => {
  try {

    const { riderId } = req.body;

    const order = await MedicineOrder.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.rider = riderId;

    order.deliveryStatus = "Assigned";

    await order.save();

    res.status(200).json({
      success: true,
      message: "Rider Assigned Successfully",
      data: order,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==========================================
// RIDER ACCEPT ORDER
// ==========================================

exports.riderAcceptOrder = async (req, res) => {

  try {

    const order = await MedicineOrder.findById(req.params.id);

    if (!order) {

      return res.status(404).json({
        success: false,
        message: "Order not found",
      });

    }

    order.rider = req.user._id;

    order.deliveryStatus = "Assigned";

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order Accepted Successfully",
      data: order,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ==========================================
// PICKUP ORDER
// ==========================================

exports.pickupOrder = async (req, res) => {

  try {

    const order = await MedicineOrder.findById(req.params.id);

    if (!order) {

      return res.status(404).json({
        success: false,
        message: "Order not found",
      });

    }

    order.orderStatus = "PICKED_UP";

    order.deliveryStatus = "Picked Up";

    order.pickedUpAt = new Date();

    await order.save();

    res.status(200).json({

      success: true,

      message: "Order Picked Successfully",

      data: order,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

// ==========================================
// OUT FOR DELIVERY
// ==========================================

exports.outForDelivery = async (req, res) => {

  try {

    const order = await MedicineOrder.findById(req.params.id);

    if (!order) {

      return res.status(404).json({

        success: false,

        message: "Order not found",

      });

    }

    order.orderStatus = "OUT_FOR_DELIVERY";

    order.deliveryStatus = "Out For Delivery";

    order.outForDeliveryAt = new Date();

    await order.save();

    res.status(200).json({

      success: true,

      message: "Order Out For Delivery",

      data: order,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

// ==========================================
// DELIVERED
// ==========================================

exports.deliveredOrder = async (req, res) => {

  try {

    const order = await MedicineOrder.findById(req.params.id);

    if (!order) {

      return res.status(404).json({

        success: false,

        message: "Order not found",

      });

    }

    order.orderStatus = "DELIVERED";

    order.deliveryStatus = "Delivered";

    order.deliveredAt = new Date();

    order.isCompleted = true;

    await order.save();

    res.status(200).json({

      success: true,

      message: "Order Delivered Successfully",

      data: order,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

// ==========================================
// CANCEL ORDER
// ==========================================

exports.cancelOrder = async (req, res) => {

  try {

    const order = await MedicineOrder.findById(req.params.id);

    if (!order) {

      return res.status(404).json({

        success: false,

        message: "Order not found",

      });

    }

    order.orderStatus = "CANCELLED";

    order.pharmacyStatus = "Rejected";

    order.cancelledAt = new Date();

    await order.save();

    res.status(200).json({

      success: true,

      message: "Order Cancelled Successfully",

      data: order,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

// ==========================================
// DELETE ORDER
// ==========================================

exports.deleteMedicineOrder = async (req, res) => {

  try {

    const order = await MedicineOrder.findByIdAndDelete(req.params.id);

    if (!order) {

      return res.status(404).json({

        success: false,

        message: "Order not found",

      });

    }

    res.status(200).json({

      success: true,

      message: "Order Deleted Successfully",

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};