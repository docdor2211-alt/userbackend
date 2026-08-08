const Wallet = require("../models/walletModel");


// =====================================================
// DEBIT WALLET
// =====================================================

exports.debitWallet = async ({
  userId,
  amount,
  title,
  subtitle,
}) => {

  console.log("============== DEBIT WALLET ==============");
  console.log("DEBIT USER ID =>", userId);

  const wallet = await Wallet.findOne({
    user: userId,
  });

  console.log("DEBIT FOUND WALLET =>", wallet);

  // WALLET NOT FOUND
  if (!wallet) {
    throw new Error("Wallet not found");
  }

  // WALLET BLOCKED
  if (wallet.status === "Blocked") {
    throw new Error("Wallet is blocked");
  }

  // INSUFFICIENT BALANCE
  if (wallet.balance < amount) {
    throw new Error("Insufficient wallet balance");
  }

  // CUT MONEY
  wallet.balance -= Number(amount);

  // SAVE TRANSACTION
  wallet.transactions.unshift({
    title,
    subtitle,
    amount,
    type: "debit",
  });

  await wallet.save();

  console.log("UPDATED USER BALANCE =>", wallet.balance);

  return wallet;
};


// =====================================================
// CREDIT WALLET
// =====================================================

exports.creditWallet = async ({
  userId,
  amount,
  title,
  subtitle,
}) => {

  console.log("============== CREDIT WALLET ==============");
  console.log("CREDIT USER ID =>", userId);

  const wallet = await Wallet.findOne({
    user: userId,
  });

  console.log("CREDIT FOUND WALLET =>", wallet);

  // WALLET NOT FOUND
  if (!wallet) {
    throw new Error("Wallet not found");
  }

  // ADD MONEY
  wallet.balance += Number(amount);

  // SAVE TRANSACTION
  wallet.transactions.unshift({
    title,
    subtitle,
    amount,
    type: "credit",
  });

  await wallet.save();

  console.log("UPDATED ADMIN BALANCE =>", wallet.balance);

  return wallet;
};