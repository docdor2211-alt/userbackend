const MedicineOrder = require("../models/medicineOrderModel");

// ============================================
// GET MY ORDERS
// ============================================

const getMyOrders = async (req, res) => {
  try {

    const orders = await MedicineOrder.find({
      user: req.user.id,   // agar order me user save hai
    })
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

// ============================================
// GET SINGLE ORDER
// ============================================

const getSingleOrder = async (req, res) => {
  try {

    const order = await MedicineOrder.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

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

module.exports = {
  getMyOrders,
  getSingleOrder,
};