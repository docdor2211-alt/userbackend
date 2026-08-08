const Wallet = require("../models/walletModel");
const crypto = require("crypto");


// ================= CREATE WALLET =================

exports.createWallet = async (req, res) => {
  try {
    const { userId } = req.body;

    // wallet already exists check
    const existingWallet = await Wallet.findOne({ user: userId });

    if (existingWallet) {
      return res.status(400).json({
        success: false,
        message: "Wallet already exists",
      });
    }

    const wallet = await Wallet.create({
      user: userId,
      walletId: "WLT-" + crypto.randomBytes(4).toString("hex"),
    });

    res.status(201).json({
      success: true,
      message: "Wallet created successfully",
      wallet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= GET WALLET =================

exports.getWallet = async (req, res) => {
  try {
    const { userId } = req.params;

    const wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found",
      });
    }

    res.status(200).json({
      success: true,
      wallet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= ADD MONEY =================

exports.addMoney = async (req, res) => {
  try {
    const { userId, amount, title, subtitle } = req.body;

    const wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found",
      });
    }

    wallet.balance += Number(amount);

    wallet.transactions.unshift({
      title: title || "Money Added",
      subtitle: subtitle || "Wallet Recharge",
      amount,
      type: "credit",
    });

    await wallet.save();

    res.status(200).json({
      success: true,
      message: "Money added successfully",
      wallet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= DEDUCT MONEY =================

exports.deductMoney = async (req, res) => {
  try {
    const { userId, amount, title, subtitle } = req.body;

    const wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found",
      });
    }

    if (wallet.balance < amount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }

    wallet.balance -= Number(amount);

    wallet.transactions.unshift({
      title: title || "Money Deducted",
      subtitle: subtitle || "Payment",
      amount,
      type: "debit",
    });

    await wallet.save();

    res.status(200).json({
      success: true,
      message: "Money deducted successfully",
      wallet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= BLOCK WALLET =================

exports.blockWallet = async (req, res) => {
  try {
    const { walletId } = req.params;

    const wallet = await Wallet.findByIdAndUpdate(
      walletId,
      {
        status: "Blocked",
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Wallet blocked",
      wallet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};