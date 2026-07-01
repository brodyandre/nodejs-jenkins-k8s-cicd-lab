process.env.APP_NAME = "Order Status API";
process.env.APP_VERSION = "1.0.0-test";

const request = require("supertest");

const app = require("../../src/app");
const { resetOrders } = require("../../src/services/orderService");

describe("order endpoints", () => {
  beforeEach(() => {
    resetOrders();
  });

  it("lists all orders", async () => {
    const response = await request(app).get("/api/v1/orders");

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      message: "Orders fetched successfully"
    });
    expect(response.body.data).toHaveLength(2);
  });

  it("returns an order by id", async () => {
    const response = await request(app).get("/api/v1/orders/1");

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      message: "Order fetched successfully",
      data: {
        id: "1",
        customerName: "Alice Johnson",
        productName: "Laptop Stand",
        quantity: 1,
        status: "CREATED"
      }
    });
  });

  it("creates a new order", async () => {
    const response = await request(app)
      .post("/api/v1/orders")
      .send({
        customerName: "  Maria Silva  ",
        productName: " Notebook Stand ",
        quantity: 2
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject({
      success: true,
      message: "Order created successfully",
      data: {
        id: "3",
        customerName: "Maria Silva",
        productName: "Notebook Stand",
        quantity: 2,
        status: "CREATED"
      }
    });
  });

  it("returns a friendly error when the order does not exist", async () => {
    const response = await request(app).get("/api/v1/orders/999");

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      success: false,
      message: "Order with id \"999\" was not found",
      error: {
        code: "ORDER_NOT_FOUND"
      }
    });
  });

  it("validates the order payload on create", async () => {
    const response = await request(app)
      .post("/api/v1/orders")
      .send({
        customerName: "",
        productName: " ",
        quantity: 0
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Invalid order payload");
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(response.body.error.details).toEqual([
      {
        field: "customerName",
        message: "customerName is required and must be a non-empty string"
      },
      {
        field: "productName",
        message: "productName is required and must be a non-empty string"
      },
      {
        field: "quantity",
        message: "quantity is required and must be a positive integer"
      }
    ]);
  });

  it("returns a 400 response for invalid json", async () => {
    const response = await request(app)
      .post("/api/v1/orders")
      .set("Content-Type", "application/json")
      .send("{\"customerName\":\"Maria\"");

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: "Request body contains invalid JSON",
      error: {
        code: "INVALID_JSON"
      }
    });
  });

  it("returns a 404 response for unknown routes", async () => {
    const response = await request(app).get("/unknown-route");

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      success: false,
      message: "Route GET /unknown-route was not found",
      error: {
        code: "ROUTE_NOT_FOUND"
      }
    });
  });
});
