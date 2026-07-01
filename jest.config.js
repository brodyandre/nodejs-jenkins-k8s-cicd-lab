module.exports = {
  clearMocks: true,
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/server.js"
  ],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  testEnvironment: "node"
};
