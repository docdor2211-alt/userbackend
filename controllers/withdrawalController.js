const Withdrawal = require("../models/withdrawalModel");
const Wallet = require("../models/walletModel");

// ======================================================
// CREATE WITHDRAWAL REQUEST
// ======================================================

exports.createWithdrawal = async (req, res) => {
    try {
        const userId = req.user._id;

        const {
            amount,
            method,
            upiId,
            accountHolderName,
            accountNumber,
            ifscCode,
            bankName,
        } = req.body;

        // ==================================================
        // AMOUNT VALIDATION
        // ==================================================

        if (
            amount === undefined ||
            amount === null ||
            amount === ""
        ) {
            return res.status(400).json({
                success: false,
                message: "Withdrawal amount is required",
            });
        }

        const withdrawAmount = Number(amount);

        if (
            !Number.isFinite(withdrawAmount) ||
            withdrawAmount <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid withdrawal amount",
            });
        }

        // Maximum 2 decimal places
        if (
            Math.round(withdrawAmount * 100) !==
            withdrawAmount * 100
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Amount can have maximum 2 decimal places",
            });
        }

        // ==================================================
        // METHOD VALIDATION (case-insensitive)
        // ==================================================

        if (!method) {
            return res.status(400).json({
                success: false,
                message:
                    "Withdrawal method is required",
            });
        }

        // Normalize method to uppercase so "bank", "Bank", "BANK" all work
        const normalizedMethod = String(method).toUpperCase();

        if (
            normalizedMethod !== "UPI" &&
            normalizedMethod !== "BANK"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Withdrawal method must be UPI or BANK",
            });
        }

        // ==================================================
        // FIND WALLET
        // ==================================================

        const wallet =
            await Wallet.findOne({
                user: userId,
            });

        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: "Wallet not found",
            });
        }

        // ==================================================
        // WALLET STATUS
        // ==================================================

        if (wallet.status === "Blocked") {
            return res.status(400).json({
                success: false,
                message:
                    "Wallet is blocked. Withdrawal is not allowed",
            });
        }

        // ==================================================
        // MINIMUM WITHDRAWAL
        // ==================================================

        const minimumWithdrawal = 100;

        if (
            withdrawAmount <
            minimumWithdrawal
        ) {
            return res.status(400).json({
                success: false,
                message:
                    `Minimum withdrawal amount is ₹${minimumWithdrawal}`,
            });
        }

        // ==================================================
        // BALANCE CHECK
        // ==================================================

        const currentBalance =
            Number(wallet.balance || 0);

        if (
            withdrawAmount >
            currentBalance
        ) {
            return res.status(400).json({
                success: false,
                message: "Insufficient wallet balance",
                balance: currentBalance,
                requestedAmount:
                    withdrawAmount,
            });
        }

        // ==================================================
        // PAYMENT DETAILS VALIDATION
        // ==================================================

        if (normalizedMethod === "UPI") {
            if (!upiId) {
                return res.status(400).json({
                    success: false,
                    message:
                        "UPI ID is required",
                });
            }

            // Basic UPI validation
            const upiRegex =
                /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+$/;

            if (!upiRegex.test(upiId)) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid UPI ID",
                });
            }
        }

        if (normalizedMethod === "BANK") {
            if (!accountHolderName) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Account holder name is required",
                });
            }

            if (!accountNumber) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Account number is required",
                });
            }

            if (!ifscCode) {
                return res.status(400).json({
                    success: false,
                    message:
                        "IFSC code is required",
                });
            }

            // Basic IFSC validation
            const ifscRegex =
                /^[A-Z]{4}0[A-Z0-9]{6}$/;

            if (
                !ifscRegex.test(
                    ifscCode.toUpperCase()
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid IFSC code",
                });
            }
        }

        // ==================================================
        // CHECK PENDING WITHDRAWAL
        // ==================================================

        const existingWithdrawal =
            await Withdrawal.findOne({
                user: userId,
                status: {
                    $in: [
                        "Pending",
                        "Processing",
                    ],
                },
            });

        if (existingWithdrawal) {
            return res.status(400).json({
                success: false,
                message:
                    "You already have a withdrawal request in progress",
                withdrawal:
                    existingWithdrawal,
            });
        }

        // ==================================================
        // CREATE WITHDRAWAL
        // ==================================================

        const withdrawal =
            await Withdrawal.create({
                user: userId,

                wallet:
                    wallet._id,

                walletId:
                    wallet.walletId,

                amount:
                    withdrawAmount,

                method:
                    normalizedMethod,

                upiId:
                    normalizedMethod === "UPI"
                        ? upiId
                        : null,

                accountHolderName:
                    normalizedMethod === "BANK"
                        ? accountHolderName
                        : null,

                accountNumber:
                    normalizedMethod === "BANK"
                        ? accountNumber
                        : null,

                ifscCode:
                    normalizedMethod === "BANK"
                        ? ifscCode.toUpperCase()
                        : null,

                bankName:
                    normalizedMethod === "BANK"
                        ? bankName || null
                        : null,

                status:
                    "Pending",
            });

        // ==================================================
        // DEDUCT BALANCE
        // ==================================================

        const oldBalance =
            currentBalance;

        const newBalance =
            oldBalance -
            withdrawAmount;

        wallet.balance =
            newBalance;

        // ==================================================
        // ADD TRANSACTION
        // ==================================================

        wallet.transactions.unshift({
            title:
                "Money Withdrawn",

            subtitle:
                normalizedMethod === "UPI"
                    ? "Withdrawal via UPI"
                    : "Withdrawal via Bank",

            amount:
                withdrawAmount,

            type:
                "debit",

            withdrawalId:
                withdrawal._id,

            date:
                new Date(),
        });

        // ==================================================
        // SAVE WALLET
        // ==================================================

        await wallet.save();

        // ==================================================
        // RESPONSE
        // ==================================================

        return res.status(201).json({
            success: true,

            message:
                "Withdrawal request created successfully",

            data: {
                withdrawalId:
                    withdrawal._id,

                walletId:
                    wallet.walletId,

                amount:
                    withdrawAmount,

                method:
                    normalizedMethod,

                status:
                    withdrawal.status,

                oldBalance:
                    oldBalance,

                newBalance:
                    newBalance,

                withdrawal:
                    withdrawal,
            },
        });

    } catch (error) {
        console.error(
            "CREATE WITHDRAWAL ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to create withdrawal request",
        });
    }
};

// ======================================================
// GET MY WITHDRAWAL HISTORY
// ======================================================

exports.getMyWithdrawals = async (
    req,
    res
) => {
    try {
        const withdrawals =
            await Withdrawal.find({
                user: req.user._id,
            })
                .sort({
                    createdAt: -1,
                })
                .lean();

        return res.status(200).json({
            success: true,

            total:
                withdrawals.length,

            withdrawals:
                withdrawals,
        });

    } catch (error) {
        console.error(
            "GET WITHDRAWAL HISTORY ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to get withdrawal history",
        });
    }
};

// ======================================================
// GET SINGLE WITHDRAWAL
// ======================================================

exports.getWithdrawalById = async (
    req,
    res
) => {
    try {
        const {
            withdrawalId,
        } = req.params;

        const withdrawal =
            await Withdrawal.findOne({
                _id: withdrawalId,
                user: req.user._id,
            });

        if (!withdrawal) {
            return res.status(404).json({
                success: false,
                message:
                    "Withdrawal not found",
            });
        }

        return res.status(200).json({
            success: true,
            withdrawal,
        });

    } catch (error) {
        console.error(
            "GET WITHDRAWAL ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to get withdrawal",
        });
    }
};

// ======================================================
// CANCEL WITHDRAWAL
// ======================================================

exports.cancelWithdrawal = async (
    req,
    res
) => {
    try {
        const {
            withdrawalId,
        } = req.params;

        const withdrawal =
            await Withdrawal.findOne({
                _id: withdrawalId,
                user: req.user._id,
            });

        if (!withdrawal) {
            return res.status(404).json({
                success: false,
                message:
                    "Withdrawal not found",
            });
        }

        // Only pending withdrawal can be cancelled
        if (
            withdrawal.status !==
            "Pending"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    `Withdrawal cannot be cancelled because its status is ${withdrawal.status}`,
            });
        }

        // Find wallet
        const wallet =
            await Wallet.findOne({
                _id:
                    withdrawal.wallet,

                user:
                    req.user._id,
            });

        if (!wallet) {
            return res.status(404).json({
                success: false,
                message:
                    "Wallet not found",
            });
        }

        // ==================================================
        // REFUND BALANCE
        // ==================================================

        const oldBalance =
            Number(wallet.balance || 0);

        const refundAmount =
            Number(withdrawal.amount);

        const newBalance =
            oldBalance +
            refundAmount;

        wallet.balance =
            newBalance;

        // ==================================================
        // UPDATE WITHDRAWAL
        // ==================================================

        withdrawal.status =
            "Cancelled";

        withdrawal.processedAt =
            new Date();

        await withdrawal.save();

        // ==================================================
        // ADD REFUND TRANSACTION
        // ==================================================

        wallet.transactions.unshift({
            title:
                "Withdrawal Cancelled",

            subtitle:
                "Withdrawal amount refunded",

            amount:
                refundAmount,

            type:
                "credit",

            withdrawalId:
                withdrawal._id,

            date:
                new Date(),
        });

        await wallet.save();

        return res.status(200).json({
            success: true,

            message:
                "Withdrawal cancelled and amount refunded",

            data: {
                withdrawalId:
                    withdrawal._id,

                refundedAmount:
                    refundAmount,

                oldBalance:
                    oldBalance,

                newBalance:
                    newBalance,

                status:
                    withdrawal.status,
            },
        });

    } catch (error) {
        console.error(
            "CANCEL WITHDRAWAL ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to cancel withdrawal",
        });
    }
};

// ======================================================
// APPROVE / COMPLETE WITHDRAWAL
// ADMIN USE
// ======================================================

exports.approveWithdrawal = async (req, res) => {
    try {
        const { withdrawalId } = req.params;

        // ==================================================
        // VALIDATE WITHDRAWAL ID
        // ==================================================

        if (!withdrawalId) {
            return res.status(400).json({
                success: false,
                message: "Withdrawal ID is required",
            });
        }

        // ==================================================
        // FIND WITHDRAWAL
        // ==================================================

        const withdrawal = await Withdrawal.findById(
            withdrawalId
        );

        if (!withdrawal) {
            return res.status(404).json({
                success: false,
                message: "Withdrawal not found",
            });
        }

        // ==================================================
        // CHECK STATUS
        // ==================================================

        if (withdrawal.status !== "Pending") {
            return res.status(400).json({
                success: false,
                message:
                    `Withdrawal cannot be approved because its status is ${withdrawal.status}`,
            });
        }

        // ==================================================
        // UPDATE WITHDRAWAL
        // ==================================================

        withdrawal.status = "Completed";

        withdrawal.completedAt = new Date();

        withdrawal.adminRemark =
            req.body.adminRemark ||
            "Withdrawal approved successfully";

        await withdrawal.save();

        // ==================================================
        // RESPONSE
        // ==================================================

        return res.status(200).json({
            success: true,

            message:
                "Withdrawal approved successfully",

            data: {
                withdrawalId:
                    withdrawal._id,

                userId:
                    withdrawal.user,

                walletId:
                    withdrawal.wallet,

                amount:
                    withdrawal.amount,

                method:
                    withdrawal.method,

                status:
                    withdrawal.status,

                adminRemark:
                    withdrawal.adminRemark,

                completedAt:
                    withdrawal.completedAt,
            },
        });

    } catch (error) {
        console.error(
            "APPROVE WITHDRAWAL ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to approve withdrawal",
        });
    }
};
