const orderService = require("../services/orderService");

const getOrders = (_req, res) => {
  const orders = orderService.listOrders();

  res.status(200).json({
    success: true,
    message: "Orders fetched successfully",
    data: orders
  });
};

const getOrderById = (req, res, next) => {
  const order = orderService.findOrderById(req.params.id);

  if (!order) {
    const error = new Error(`Order with id "${req.params.id}" was not found`);
    error.statusCode = 404;
    error.code = "ORDER_NOT_FOUND";
    return next(error);
  }

  return res.status(200).json({
    success: true,
    message: "Order fetched successfully",
    data: order
  });
};

const createOrder = (req, res) => {
  const order = orderService.createOrder(req.body);

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    data: order
  });
};

module.exports = {
  createOrder,
  getOrderById,
  getOrders
};
