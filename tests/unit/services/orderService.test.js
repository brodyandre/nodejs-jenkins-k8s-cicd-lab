const orderService = require("../../../src/services/orderService");

describe("orderService", () => {
  beforeEach(() => {
    orderService.resetOrders();
  });

  it("returns the seed orders", () => {
    const orders = orderService.listOrders();

    expect(orders).toHaveLength(2);
    expect(orders[0]).toMatchObject({
      id: "1",
      customerName: "Alice Johnson",
      status: "CREATED"
    });
  });

  it("returns cloned data from listOrders", () => {
    const orders = orderService.listOrders();

    orders[0].status = "SHIPPED";

    expect(orderService.findOrderById("1")).toMatchObject({
      id: "1",
      status: "CREATED"
    });
  });

  it("finds an order by id", () => {
    const order = orderService.findOrderById("2");

    expect(order).toMatchObject({
      id: "2",
      customerName: "Bruno Costa",
      productName: "Wireless Mouse",
      quantity: 2
    });
  });

  it("returns null when the order does not exist", () => {
    expect(orderService.findOrderById("999")).toBeNull();
  });

  it("creates an order and persists it in memory", () => {
    const order = orderService.createOrder({
      customerName: "  Maria Silva  ",
      productName: " Notebook Stand ",
      quantity: 2
    });

    expect(order).toMatchObject({
      id: "3",
      customerName: "Maria Silva",
      productName: "Notebook Stand",
      quantity: 2,
      status: "CREATED",
      createdAt: expect.any(String)
    });
    expect(orderService.listOrders()).toHaveLength(3);
  });
});
