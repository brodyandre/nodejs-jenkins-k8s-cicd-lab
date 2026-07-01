const INITIAL_ORDERS = [
  {
    id: "1",
    customerName: "Alice Johnson",
    productName: "Laptop Stand",
    quantity: 1,
    status: "CREATED",
    createdAt: "2026-01-10T09:00:00.000Z"
  },
  {
    id: "2",
    customerName: "Bruno Costa",
    productName: "Wireless Mouse",
    quantity: 2,
    status: "CREATED",
    createdAt: "2026-01-11T15:30:00.000Z"
  }
];

let orders = [];
let nextId = 1;

const cloneOrder = (order) => ({ ...order });

const resetOrders = () => {
  orders = INITIAL_ORDERS.map(cloneOrder);
  nextId = INITIAL_ORDERS.length + 1;
};

const listOrders = () => orders.map(cloneOrder);

const findOrderById = (id) => {
  const order = orders.find((currentOrder) => currentOrder.id === id);

  return order ? cloneOrder(order) : null;
};

const createOrder = ({ customerName, productName, quantity }) => {
  const order = {
    id: String(nextId),
    customerName: customerName.trim(),
    productName: productName.trim(),
    quantity,
    status: "CREATED",
    createdAt: new Date().toISOString()
  };

  orders.push(order);
  nextId += 1;

  return cloneOrder(order);
};

resetOrders();

module.exports = {
  createOrder,
  findOrderById,
  listOrders,
  resetOrders
};
