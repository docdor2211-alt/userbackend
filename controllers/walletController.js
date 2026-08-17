 

const Wallet = require("../models/walletModel");
const Withdrawal = require("../models/withdrawalModel");
const crypto = require("crypto");
const razorpay = require("../utils/razorpay");

// ======================================================
// CREATE WALLET
// ======================================================

exports.createWallet = async (req, res) => {
  try {
    const userId = req.user._id;

    // Check existing wallet
    const existingWallet = await Wallet.findOne({
      user: userId,
    });

    if (existingWallet) {
      return res.status(400).json({
        success: false,
        message: "Wallet already exists",
        wallet: existingWallet,
      });
    }

    // Generate wallet ID
    const walletId =
      "WLT-" +
      crypto.randomBytes(4).toString("hex").toUpperCase();

    // Create wallet
    const wallet = await Wallet.create({
      user: userId,
      walletId,
      balance: 0,
      status: "Active",
      transactions: [],
    });

    return res.status(201).json({
      success: true,
      message: "Wallet created successfully",
      wallet,
    });
  } catch (error) {
    console.error("CREATE WALLET ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create wallet",
    });
  }
};

// ======================================================
// GET MY WALLET
// ======================================================

exports.getWallet = async (req, res) => {
  try {
    const userId = req.user._id;

    const wallet = await Wallet.findOne({
      user: userId,
    });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found",
      });
    }

    return res.status(200).json({
      success: true,
      wallet,
    });
  } catch (error) {
    console.error("GET WALLET ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get wallet",
    });
  }
};

// ======================================================
// GET WALLET BY USER ID
// ADMIN / SPECIAL USE
// ======================================================

exports.getWalletByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const wallet = await Wallet.findOne({
      user: userId,
    });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found",
      });
    }

    return res.status(200).json({
      success: true,
      wallet,
    });
  } catch (error) {
    console.error("GET WALLET BY USER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get wallet",
    });
  }
};

// ======================================================
// CREATE RAZORPAY WALLET ORDER
// ======================================================

exports.createWalletOrder = async (req, res) => {
  try {
    console.log("======================================");
    console.log("CREATE WALLET ORDER");
    console.log("======================================");

    console.log("USER ID:", req.user?._id);
    console.log("REQUEST BODY:", req.body);

    const { amount } = req.body;

    // ==================================================
    // VALIDATE AMOUNT
    // ==================================================

    if (
      amount === undefined ||
      amount === null ||
      amount === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Amount is required",
      });
    }

    const numericAmount = Number(amount);

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    // Maximum 2 decimal places
    if (
      Math.round(numericAmount * 100) !==
      numericAmount * 100
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Amount can have maximum 2 decimal places",
      });
    }

    // Convert INR to paise
    const amountInPaise = Math.round(
      numericAmount * 100
    );

    console.log("AMOUNT INR:", numericAmount);
    console.log("AMOUNT PAISE:", amountInPaise);

    // ==================================================
    // CHECK RAZORPAY ENV
    // ==================================================

    if (!process.env.RAZORPAY_KEY_ID) {
      console.error(
        "RAZORPAY_KEY_ID IS MISSING"
      );

      return res.status(500).json({
        success: false,
        message:
          "RAZORPAY_KEY_ID is missing in environment variables",
      });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error(
        "RAZORPAY_KEY_SECRET IS MISSING"
      );

      return res.status(500).json({
        success: false,
        message:
          "RAZORPAY_KEY_SECRET is missing in environment variables",
      });
    }

    console.log(
      "RAZORPAY KEY:",
      process.env.RAZORPAY_KEY_ID
    );

    // ==================================================
    // FIND WALLET
    // ==================================================

    const wallet = await Wallet.findOne({
      user: req.user._id,
    });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message:
          "Wallet not found. Please create wallet first.",
      });
    }

    console.log(
      "WALLET ID:",
      wallet.walletId
    );

    // ==================================================
    // CHECK WALLET STATUS
    // ==================================================

    if (wallet.status === "Blocked") {
      return res.status(400).json({
        success: false,
        message: "Wallet is blocked",
      });
    }

    // ==================================================
    // CREATE RAZORPAY ORDER
    // ==================================================

    const options = {
      amount: amountInPaise,

      currency: "INR",

      receipt:
        `wallet_${Date.now()}`,

      notes: {
        userId:
          req.user._id.toString(),

        walletId:
          wallet.walletId,
      },
    };

    console.log(
      "RAZORPAY ORDER OPTIONS:",
      options
    );

    const order =
      await razorpay.orders.create(
        options
      );

    console.log(
      "RAZORPAY ORDER CREATED:",
      order
    );

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,

      message:
        "Wallet order created successfully",

      order: {
        id: order.id,

        entity: order.entity,

        amount: order.amount,

        currency: order.currency,

        status: order.status,

        receipt: order.receipt,
      },

      amount: numericAmount,

      amountInPaise: amountInPaise,

      walletId:
        wallet.walletId,

      walletMongoId:
        wallet._id,

      keyId:
        process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error(
      "======================================"
    );

    console.error(
      "CREATE WALLET ORDER ERROR"
    );

    console.error(
      "======================================"
    );

    console.error(
      "MESSAGE:",
      error.message
    );

    console.error(
      "STATUS:",
      error.statusCode
    );

    console.error(
      "ERROR:",
      error.error
    );

    console.error(
      "DESCRIPTION:",
      error.error?.description
    );

    console.error(
      "CODE:",
      error.error?.code
    );

    return res.status(
      error.statusCode || 500
    ).json({
      success: false,

      message:
        error.error?.description ||
        error.message ||
        "Failed to create Razorpay order",

      code:
        error.error?.code || null,
    });
  }
};

// ======================================================
// VERIFY WALLET PAYMENT
// ======================================================

exports.verifyWalletPayment = async (req, res) => {
  try {
    console.log("======================================");
    console.log("VERIFY WALLET PAYMENT");
    console.log("======================================");

    const {
      walletId,
      amount,
      currency,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = req.body;

    // ==================================================
    // VALIDATION
    // ==================================================

    if (!walletId) {
      return res.status(400).json({
        success: false,
        message: "walletId is required",
      });
    }

    if (
      amount === undefined ||
      amount === null ||
      amount === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Amount is required",
      });
    }

    if (!currency) {
      return res.status(400).json({
        success: false,
        message: "Currency is required",
      });
    }

    if (!razorpay_payment_id) {
      return res.status(400).json({
        success: false,
        message:
          "razorpay_payment_id is required",
      });
    }

    if (!razorpay_order_id) {
      return res.status(400).json({
        success: false,
        message:
          "razorpay_order_id is required",
      });
    }

    if (!razorpay_signature) {
      return res.status(400).json({
        success: false,
        message:
          "razorpay_signature is required",
      });
    }

    // ==================================================
    // CURRENCY
    // ==================================================

    if (currency !== "INR") {
      return res.status(400).json({
        success: false,
        message:
          "Only INR currency is supported",
      });
    }

    // ==================================================
    // FIND WALLET
    // ==================================================

    const wallet =
      await Wallet.findOne({
        walletId: walletId,
        user: req.user._id,
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
        message: "Wallet is blocked",
      });
    }

    // ==================================================
    // DUPLICATE PAYMENT CHECK
    // ==================================================

    const alreadyCredited =
      wallet.transactions.some(
        (transaction) =>
          transaction.razorpayPaymentId ===
          razorpay_payment_id
      );

    if (alreadyCredited) {
      return res.status(400).json({
        success: false,
        message:
          "Payment already processed",
        balance:
          wallet.balance,
      });
    }

    // ==================================================
    // VERIFY RAZORPAY SIGNATURE
    // ==================================================

    const signatureBody =
      razorpay_order_id +
      "|" +
      razorpay_payment_id;

    const expectedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_KEY_SECRET
        )
        .update(signatureBody)
        .digest("hex");

    if (
      expectedSignature !==
      razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid payment signature",
      });
    }

    console.log(
      "SIGNATURE VERIFIED"
    );

    // ==================================================
    // FETCH RAZORPAY ORDER
    // ==================================================

    const razorpayOrder =
      await razorpay.orders.fetch(
        razorpay_order_id
      );

    if (!razorpayOrder) {
      return res.status(400).json({
        success: false,
        message:
          "Razorpay order not found",
      });
    }

    console.log(
      "RAZORPAY ORDER:",
      razorpayOrder
    );

    // ==================================================
    // CHECK ORDER CURRENCY
    // ==================================================

    if (
      razorpayOrder.currency !==
      currency
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Currency mismatch",
      });
    }

    // ==================================================
    // CHECK ORDER AMOUNT
    // ==================================================

    const razorpayAmount =
      Number(
        razorpayOrder.amount
      ) / 100;

    const requestedAmount =
      Number(amount);

    if (
      !Number.isFinite(requestedAmount) ||
      requestedAmount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid payment amount",
      });
    }

    if (
      requestedAmount !==
      razorpayAmount
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Payment amount does not match Razorpay order amount",

        razorpayAmount:
          razorpayAmount,

        receivedAmount:
          requestedAmount,
      });
    }

    // ==================================================
    // FETCH RAZORPAY PAYMENT
    // ==================================================

    let razorpayPayment =
      await razorpay.payments.fetch(
        razorpay_payment_id
      );

    console.log(
      "PAYMENT BEFORE CAPTURE:",
      razorpayPayment.status
    );

    // ==================================================
    // CHECK PAYMENT ORDER ID
    // ==================================================

    if (
      razorpayPayment.order_id !==
      razorpay_order_id
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Payment does not belong to this order",
      });
    }

    // ==================================================
    // CHECK PAYMENT AMOUNT
    // ==================================================

    const paymentAmount =
      Number(
        razorpayPayment.amount
      ) / 100;

    if (
      paymentAmount !==
      razorpayAmount
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Payment amount mismatch",

        orderAmount:
          razorpayAmount,

        paymentAmount:
          paymentAmount,
      });
    }

    // ==================================================
    // CAPTURE AUTHORIZED PAYMENT
    // ==================================================

    if (
      razorpayPayment.status ===
      "authorized"
    ) {
      console.log(
        "PAYMENT AUTHORIZED"
      );

      console.log(
        "STARTING PAYMENT CAPTURE..."
      );

      try {
        const captureResponse =
          await razorpay.payments.capture(
            razorpay_payment_id,

            Math.round(
              razorpayAmount * 100
            ),

            currency
          );

        console.log(
          "CAPTURE RESPONSE:",
          captureResponse
        );

      } catch (captureError) {
        console.error(
          "RAZORPAY CAPTURE ERROR:",
          captureError
        );

        return res.status(400).json({
          success: false,

          message:
            captureError.error
              ?.description ||
            captureError.message ||
            "Payment capture failed",

          paymentStatus:
            razorpayPayment.status,

          razorpayError:
            captureError.error ||
            null,
        });
      }

      // Fetch payment again
      razorpayPayment =
        await razorpay.payments.fetch(
          razorpay_payment_id
        );

      console.log(
        "PAYMENT AFTER CAPTURE:",
        razorpayPayment.status
      );
    }

    // ==================================================
    // ALREADY CAPTURED
    // ==================================================

    if (
      razorpayPayment.status ===
      "captured"
    ) {
      console.log(
        "PAYMENT IS ALREADY CAPTURED"
      );
    }

    // ==================================================
    // FINAL PAYMENT STATUS
    // ==================================================

    if (
      razorpayPayment.status !==
      "captured"
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Payment could not be captured",

        paymentStatus:
          razorpayPayment.status,
      });
    }

    // ==================================================
    // FINAL DUPLICATE CHECK
    // ==================================================

    const paymentAlreadyAdded =
      wallet.transactions.some(
        (transaction) =>
          transaction.razorpayPaymentId ===
          razorpay_payment_id
      );

    if (paymentAlreadyAdded) {
      return res.status(400).json({
        success: false,
        message:
          "Payment already processed",
        balance:
          wallet.balance,
      });
    }

    // ==================================================
    // UPDATE WALLET
    // ==================================================

    const oldBalance =
      Number(wallet.balance || 0);

    // IMPORTANT:
    // Razorpay order amount is source of truth
    const rechargeAmount =
      razorpayAmount;

    const newBalance =
      oldBalance +
      rechargeAmount;

    wallet.balance =
      newBalance;

    // ==================================================
    // ADD TRANSACTION
    // ==================================================

    wallet.transactions.unshift({
      title:
        "Money Added",

      subtitle:
        "Wallet Recharge via Razorpay",

      amount:
        rechargeAmount,

      type:
        "credit",

      razorpayOrderId:
        razorpay_order_id,

      razorpayPaymentId:
        razorpay_payment_id,

      date:
        new Date(),
    });

    // ==================================================
    // SAVE WALLET
    // ==================================================

    await wallet.save();

    console.log(
      "======================================"
    );

    console.log(
      "WALLET UPDATED SUCCESSFULLY"
    );

    console.log({
      walletId:
        wallet.walletId,

      oldBalance:
        oldBalance,

      rechargeAmount:
        rechargeAmount,

      newBalance:
        wallet.balance,
    });

    console.log(
      "======================================"
    );

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,

      message:
        "Payment verified and money added to wallet successfully",

      data: {
        userId:
          req.user._id,

        walletId:
          wallet.walletId,

        amount:
          rechargeAmount,

        currency:
          currency,

        razorpay_payment_id:
          razorpay_payment_id,

        razorpay_order_id:
          razorpay_order_id,

        paymentStatus:
          razorpayPayment.status,

        oldBalance:
          oldBalance,

        newBalance:
          wallet.balance,

        balance:
          wallet.balance,
      },
    });
  } catch (error) {
    console.error(
      "======================================"
    );

    console.error(
      "VERIFY WALLET PAYMENT ERROR"
    );

    console.error(
      error
    );

    console.error(
      "MESSAGE:",
      error.message
    );

    console.error(
      "RAZORPAY ERROR:",
      error.error
    );

    console.error(
      "DESCRIPTION:",
      error.error?.description
    );

    console.error(
      "CODE:",
      error.error?.code
    );

    console.error(
      "======================================"
    );

    return res.status(
      error.statusCode || 500
    ).json({
      success: false,

      message:
        error.error?.description ||
        error.message ||
        "Payment verification failed",

      code:
        error.error?.code ||
        null,
    });
  }
};

// ======================================================
// WALLET HISTORY
// ======================================================

exports.getWalletHistory = async (
  req,
  res
) => {
  try {
    const wallet =
      await Wallet.findOne({
        user: req.user._id,
      }).select(
        "walletId balance status transactions"
      );

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message:
          "Wallet not found",
      });
    }

    // Latest transaction first
    const transactions =
      [...wallet.transactions].sort(
        (a, b) =>
          new Date(b.date) -
          new Date(a.date)
      );

    return res.status(200).json({
      success: true,

      wallet: {
        walletId:
          wallet.walletId,

        balance:
          wallet.balance,

        status:
          wallet.status,
      },

      totalTransactions:
        transactions.length,

      transactions:
        transactions,
    });
  } catch (error) {
    console.error(
      "GET WALLET HISTORY ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to get wallet history",
    });
  }
};

// ======================================================
// BLOCK WALLET
// ======================================================

exports.blockWallet = async (
  req,
  res
) => {
  try {
    const { walletId } =
      req.params;

    if (!walletId) {
      return res.status(400).json({
        success: false,
        message:
          "Wallet ID is required",
      });
    }

    const wallet =
      await Wallet.findOneAndUpdate(
        {
          walletId:
            walletId,

          user:
            req.user._id,
        },

        {
          status:
            "Blocked",
        },

        {
          new:
            true,
        }
      );

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message:
          "Wallet not found",
      });
    }

    return res.status(200).json({
      success: true,

      message:
        "Wallet blocked successfully",

      wallet,
    });
  } catch (error) {
    console.error(
      "BLOCK WALLET ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to block wallet",
    });
  }
};

