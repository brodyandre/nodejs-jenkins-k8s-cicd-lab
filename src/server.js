const app = require("./app");

const host = "0.0.0.0";
const port = Number(process.env.PORT) || 3000;
const appName = process.env.APP_NAME || "Order Status API";
const appVersion = process.env.APP_VERSION || "1.0.0";

app.listen(port, host, () => {
  console.log(`${appName} v${appVersion} listening on ${host}:${port}`);
});
