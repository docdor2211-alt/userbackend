const express = require("express");

const router = express.Router();

const {
  createWallet,
  getWallet,
  getWalletByUserId,
  createWalletOrder,
  verifyWalletPayment,
  getWalletHistory,
  blockWallet,
} = require("../controllers/walletController");

const {
  createWithdrawal,
  getMyWithdrawals,
  getWithdrawalById,
  cancelWithdrawal,
  approveWithdrawal,
} = require("../controllers/withdrawalController");

const {
  protect,
} = require("../middleware/authMiddleware");


// CREATE WALLET

router.post(
  "/create",
  protect,
  createWallet
);


// GET MY WALLET

router.get(
  "/my-wallet",
  protect,
  getWallet
);


// GET WALLET BY USER ID

router.get(
  "/user/:userId",
  protect,
  getWalletByUserId
);


// WALLET HISTORY

router.get(
  "/history",
  protect,
  getWalletHistory
);


// CREATE RAZORPAY ORDER

router.post(
  "/add-money/order",
  protect,
  createWalletOrder
);


// VERIFY RAZORPAY PAYMENT

router.post(
  "/add-money/verify",
  protect,
  verifyWalletPayment
);


// CREATE WITHDRAWAL

router.post(
  "/withdraw",
  protect,
  createWithdrawal
);


// MY WITHDRAWALS

router.get(
  "/withdrawals",
  protect,
  getMyWithdrawals
);


// SINGLE WITHDRAWAL

router.get(
  "/withdrawals/:withdrawalId",
  protect,
  getWithdrawalById
);


// CANCEL WITHDRAWAL

router.put(
  "/withdrawals/:withdrawalId/cancel",
  protect,
  cancelWithdrawal
);

// APPROVE
router.put(
  "/:withdrawalId/approve",
  protect,
  approveWithdrawal
);


// BLOCK WALLET

router.put(
  "/block/:walletId",
  protect,
  blockWallet
);


// OLD GET WALLET ROUTE

router.get(
  "/:userId",
  protect,
  getWalletByUserId
);


module.exports = router;