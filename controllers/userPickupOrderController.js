const PickupOrder = require(
  "../models/userPickupOrderModel"
);

// ==========================================
// CREATE USER PICKUP ORDER
// ==========================================

const createUserPickupOrder =
  async (req, res) => {

    try {

      const {

        pharmacy,

        customerName,

        customerPhone,

        pickupTime,

        items,

        totalAmount,

        address,

      } = req.body;

      // =========================
      // USER AUTH CHECK
      // =========================

      if (!req.user?._id) {

        return res.status(401).json({

          success: false,

          message:
            "User not authenticated",

        });

      }

      // =========================
      // GENERATE ORDER ID
      // =========================

      const orderId =
        "ORD-" + Date.now();

      // =========================
      // CREATE ORDER
      // =========================

      const order =
        await PickupOrder.create({

          user:
            req.user._id,

          pharmacy,

          orderId,

          customerName,

          customerPhone,

          pickupTime,

          items,

          totalAmount,

          address,

          status:
            "pending",

        });

      res.status(201).json({

        success: true,

        message:
          "Pickup order created successfully",

        data: order,

      });

    } catch (error) {

      console.log(
        "CREATE ORDER ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };


// ==========================================
// GET USER ORDERS
// ==========================================

const getUserOrders =
  async (req, res) => {

    try {

      // =========================
      // USER AUTH CHECK
      // =========================

      if (!req.user?._id) {

        return res.status(401).json({

          success: false,

          message:
            "User not authenticated",

        });

      }

      // =========================
      // GET ORDERS
      // =========================

      const orders =
        await PickupOrder.find({

          user:
            req.user._id,

        })

        .sort({
          createdAt: -1,
        });

      res.status(200).json({

        success: true,

        total:
          orders.length,

        data: orders,

      });

    } catch (error) {

      console.log(
        "GET USER ORDERS ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };


// ==========================================
// GET SINGLE USER ORDER
// ==========================================

const getSingleUserOrder =
  async (req, res) => {

    try {

      const order =
        await PickupOrder.findOne({

          _id:
            req.params.id,

          user:
            req.user._id,

        });

      // =========================
      // ORDER NOT FOUND
      // =========================

      if (!order) {

        return res.status(404).json({

          success: false,

          message:
            "Order not found",

        });

      }

      res.status(200).json({

        success: true,

        data: order,

      });

    } catch (error) {

      console.log(
        "GET SINGLE ORDER ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };


// ==========================================
// CANCEL USER ORDER
// ==========================================

const cancelUserOrder =
  async (req, res) => {

    try {

      const order =
        await PickupOrder.findOne({

          _id:
            req.params.id,

          user:
            req.user._id,

        });

      // =========================
      // ORDER NOT FOUND
      // =========================

      if (!order) {

        return res.status(404).json({

          success: false,

          message:
            "Order not found",

        });

      }

      // =========================
      // CANCEL ORDER
      // =========================

      order.status =
        "cancelled";

      await order.save();

      res.status(200).json({

        success: true,

        message:
          "Order cancelled successfully",

        data: order,

      });

    } catch (error) {

      console.log(
        "CANCEL ORDER ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };


// ==========================================
// EXPORTS
// ==========================================

module.exports = {

  createUserPickupOrder,

  getUserOrders,

  getSingleUserOrder,

  cancelUserOrder,

};