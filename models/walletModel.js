const mongoose = require("mongoose");


// ======================================================
// TRANSACTION SCHEMA
// ======================================================

const transactionSchema = new mongoose.Schema(
  {
    // Transaction title
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Transaction subtitle
    subtitle: {
      type: String,
      default: "",
      trim: true,
    },

    // Transaction amount
    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Credit / Debit
    type: {
      type: String,
      enum: ["credit", "debit"],
      required: true,
    },

    // Razorpay Order ID
    // Wallet recharge ke time use hoga
    razorpayOrderId: {
      type: String,
      default: null,
    },

    // Razorpay Payment ID
    // Duplicate payment prevent karne ke liye use hoga
    razorpayPaymentId: {
      type: String,
      default: null,
      unique: true,
      sparse: true,
    },

    // Transaction date
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: true,
  }
);


// ======================================================
// WALLET SCHEMA
// ======================================================

const walletSchema = new mongoose.Schema(
  {
    // User whose wallet this belongs to
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Unique wallet ID
    walletId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    // Current wallet balance
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Wallet status
    status: {
      type: String,
      enum: ["Active", "Blocked"],
      default: "Active",
    },

    // Wallet transactions
    transactions: {
      type: [transactionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model(
  "Wallet",
  walletSchema
);