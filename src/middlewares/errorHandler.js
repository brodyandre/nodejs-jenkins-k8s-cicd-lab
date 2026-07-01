const DEFAULT_ERROR_CODES = {
  400: "BAD_REQUEST",
  404: "NOT_FOUND",
  500: "INTERNAL_ERROR"
};

const getErrorCode = (statusCode, code) => (
  code || DEFAULT_ERROR_CODES[statusCode] || DEFAULT_ERROR_CODES[500]
);

const errorHandler = (err, _req, res, _next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Request body contains invalid JSON",
      error: {
        code: "INVALID_JSON"
      }
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = statusCode >= 500
    ? "An unexpected error occurred"
    : err.message;
  const response = {
    success: false,
    message,
    error: {
      code: getErrorCode(statusCode, err.code)
    }
  };

  if (Array.isArray(err.details) && err.details.length > 0) {
    response.error.details = err.details;
  }

  return res.status(statusCode).json(response);
};

module.exports = errorHandler;
