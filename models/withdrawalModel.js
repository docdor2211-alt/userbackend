const mongoose = require("mongoose");

const withdrawalSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        wallet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Wallet",
            required: true,
            index: true,
        },

        amount: {
            type: Number,
            required: true,
            min: 1,
        },

        method: {
            type: String,
            enum: ["BANK", "UPI"],
            required: true,
        },

        accountHolderName: {
            type: String,
            default: null,
            trim: true,
        },

        accountNumber: {
            type: String,
            default: null,
            trim: true,
        },

        ifscCode: {
            type: String,
            default: null,
            uppercase: true,
            trim: true,
        },

        bankName: {
            type: String,
            default: null,
            trim: true,
        },

        upiId: {
            type: String,
            default: null,
            trim: true,
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Processing",
                "Completed",
                "Rejected",
                "Cancelled",
            ],
            default: "Pending",
            index: true,
        },

        adminRemark: {
            type: String,
            default: "",
            trim: true,
        },

        cancelledAt: {
            type: Date,
            default: null,
        },

        completedAt: {
            type: Date,
            default: null,
        },

        rejectedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "Withdrawal",
    withdrawalSchema
);