const getServiceMetadata = () => ({
  app: process.env.APP_NAME || "Order Status API",
  version: process.env.APP_VERSION || "1.0.0",
  timestamp: new Date().toISOString()
});

const getHealth = (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Service is healthy",
    data: {
      status: "ok",
      ...getServiceMetadata()
    }
  });
};

const getReady = (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Service is ready",
    data: {
      ready: true,
      ...getServiceMetadata()
    }
  });
};

module.exports = {
  getHealth,
  getReady
};
