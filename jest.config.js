module.exports = {
  clearMocks: true,
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/server.js"
  ],
  testEnvironment: "node"
};
