const notFoundHandler = (req, _res, next) => {
  const error = new Error(`Route ${req.method} ${req.originalUrl} was not found`);
  error.statusCode = 404;
  error.code = "ROUTE_NOT_FOUND";

  next(error);
};

module.exports = notFoundHandler;
