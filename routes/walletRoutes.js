const express = require("express");

const router = express.Router();

const {
  createWallet,
  getWallet,
  addMoney,
  deductMoney,
  blockWallet,
} = require("../controllers/walletController");


// CREATE
router.post("/create", createWallet);

// GET
router.get("/:userId", getWallet);

// ADD MONEY
router.post("/add-money", addMoney);

// DEDUCT MONEY
router.post("/deduct-money", deductMoney);

// BLOCK
router.put("/block/:walletId", blockWallet);

module.exports = router;