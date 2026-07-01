process.env.APP_NAME = "Order Status API";
process.env.APP_VERSION = "1.0.0-test";

const request = require("supertest");

const app = require("../../src/app");

describe("health endpoints", () => {
  it("returns application health metadata", async () => {
    const response = await request(app).get("/health");

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      message: "Service is healthy",
      data: {
        status: "ok",
        app: "Order Status API",
        version: "1.0.0-test",
        timestamp: expect.any(String)
      }
    });
    expect(Number.isNaN(Date.parse(response.body.data.timestamp))).toBe(false);
  });

  it("returns readiness metadata", async () => {
    const response = await request(app).get("/ready");

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      message: "Service is ready",
      data: {
        ready: true,
        app: "Order Status API",
        version: "1.0.0-test",
        timestamp: expect.any(String)
      }
    });
    expect(Number.isNaN(Date.parse(response.body.data.timestamp))).toBe(false);
  });
});
