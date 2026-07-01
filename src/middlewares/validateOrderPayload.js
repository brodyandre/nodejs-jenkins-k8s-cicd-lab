const isNonEmptyString = (value) => (
  typeof value === "string" && value.trim().length > 0
);

const validateOrderPayload = (req, _res, next) => {
  const { customerName, productName, quantity } = req.body || {};
  const errors = [];

  if (!isNonEmptyString(customerName)) {
    errors.push({
      field: "customerName",
      message: "customerName is required and must be a non-empty string"
    });
  }

  if (!isNonEmptyString(productName)) {
    errors.push({
      field: "productName",
      message: "productName is required and must be a non-empty string"
    });
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    errors.push({
      field: "quantity",
      message: "quantity is required and must be a positive integer"
    });
  }

  if (errors.length > 0) {
    const error = new Error("Invalid order payload");
    error.statusCode = 400;
    error.code = "VALIDATION_ERROR";
    error.details = errors;

    return next(error);
  }

  return next();
};

module.exports = validateOrderPayload;
