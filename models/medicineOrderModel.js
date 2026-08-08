// // models/medicineOrderModel.js

// const mongoose = require("mongoose");

// const medicineOrderSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     items: [
//       {
//         product: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Medicine",
//           required: true,
//         },

//         name: {
//           type: String,
//           required: true,
//         },

//         image: {
//           type: String,
//           default: "",
//         },

//         quantity: {
//           type: Number,
//           required: true,
//           default: 1,
//         },

//         price: {
//           type: Number,
//           required: true,
//         },

//         totalPrice: {
//           type: Number,
//           required: true,
//         },
//       },
//     ],

//     totalAmount: {
//       type: Number,
//       required: true,
//     },

//     paymentMethod: {
//       type: String,
//       enum: ["COD", "ONLINE", "WALLET"],
//       default: "COD",
//     },

//     paymentStatus: {
//       type: String,
//       enum: ["PENDING", "PAID", "FAILED"],
//       default: "PENDING",
//     },

//     orderStatus: {
//       type: String,
//       enum: [
//         "PLACED",
//         "CONFIRMED",
//         "PROCESSING",
//         "SHIPPED",
//         "DELIVERED",
//         "CANCELLED",
//       ],
//       default: "PLACED",
//     },

//     deliveryAddress: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     // Razorpay Details
//     razorpayOrderId: {
//       type: String,
//       default: "",
//     },

//     razorpayPaymentId: {
//       type: String,
//       default: "",
//     },

//     razorpaySignature: {
//       type: String,
//       default: "",
//     },

//     paidAt: {
//       type: Date,
//     },

//     deliveredAt: {
//       type: Date,
//     },

//     isCompleted: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model(
//   "MedicineOrder",
//   medicineOrderSchema
// );



// models/medicineOrderModel.js

const mongoose = require("mongoose");

// ======================================================
// ORDER ITEM
// ======================================================

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    quantity: {
      type: Number,
      required: true,
      default: 1,
    },

    price: {
      type: Number,
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  }
);

// ======================================================
// MEDICINE ORDER
// ======================================================

const medicineOrderSchema = new mongoose.Schema(
  {
    // ===========================
    // USER
    // ===========================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ===========================
    // RIDER
    // ===========================

    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rider",
      default: null,
    },

    // ===========================
    // ORDER ITEMS
    // ===========================

    items: {
      type: [orderItemSchema],
      default: [],
    },

    // ===========================
    // TOTAL
    // ===========================

    totalAmount: {
      type: Number,
      required: true,
    },

    // ===========================
    // DELIVERY ADDRESS
    // ===========================

    deliveryAddress: {
      type: String,
      required: true,
      trim: true,
    },

    // ===========================
    // PAYMENT
    // ===========================

    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE", "WALLET"],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },

    // ===========================
    // ORDER STATUS
    // ===========================

    orderStatus: {
      type: String,
      enum: [
        "PLACED",
        "CONFIRMED",
        "PACKED",
        "PICKED_UP",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
      ],
      default: "PLACED",
    },

    // ===========================
    // MANAGEMENT STATUS
    // ===========================

    pharmacyStatus: {
      type: String,
      enum: [
        "Pending",
        "Accepted",
        "Rejected",
      ],
      default: "Pending",
    },

    // ===========================
    // DELIVERY STATUS
    // ===========================

    deliveryStatus: {
      type: String,
      enum: [
        "Pending",
        "Assigned",
        "Picked Up",
        "Out For Delivery",
        "Delivered",
      ],
      default: "Pending",
    },

    // ===========================
    // OTP
    // ===========================

    deliveryOTP: {
      type: String,
      default: "",
    },

    // ===========================
    // RAZORPAY
    // ===========================

    razorpayOrderId: {
      type: String,
      default: "",
    },

    razorpayPaymentId: {
      type: String,
      default: "",
    },

    razorpaySignature: {
      type: String,
      default: "",
    },

    // ===========================
    // TIMELINE
    // ===========================

    acceptedAt: Date,

    packedAt: Date,

    pickedUpAt: Date,

    outForDeliveryAt: Date,

    deliveredAt: Date,

    cancelledAt: Date,

    paidAt: Date,

    // ===========================
    // COMPLETED
    // ===========================

    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "MedicineOrder",
  medicineOrderSchema
);