const errorHandler = require("../../../src/middlewares/errorHandler");

const createResponse = () => {
  const response = {};

  response.status = (statusCode) => {
    response.statusCode = statusCode;
    return response;
  };

  response.json = (body) => {
    response.body = body;
    return response;
  };

  return response;
};

describe("errorHandler middleware", () => {
  it("does not expose internal stack traces in production responses", () => {
    const previousNodeEnv = process.env.NODE_ENV;

    try {
      process.env.NODE_ENV = "production";

      const error = new Error("Database connection failed");
      error.stack = "sensitive-stack-trace";

      const response = createResponse();

      errorHandler(error, {}, response, () => {});

      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({
        success: false,
        message: "An unexpected error occurred",
        error: {
          code: "INTERNAL_ERROR"
        }
      });
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
    }
  });
});
