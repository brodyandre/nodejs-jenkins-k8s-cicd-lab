const express = require("express");

const {
  createOrder,
  getOrderById,
  getOrders
} = require("../controllers/orderController");
const validateOrderPayload = require("../middlewares/validateOrderPayload");

const router = express.Router();

router.get("/", getOrders);
router.get("/:id", getOrderById);
router.post("/", validateOrderPayload, createOrder);

module.exports = router;
