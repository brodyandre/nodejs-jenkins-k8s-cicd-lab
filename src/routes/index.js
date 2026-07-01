const express = require("express");

const { getHealth, getReady } = require("../controllers/healthController");
const orderRoutes = require("./orderRoutes");

const router = express.Router();

router.get("/health", getHealth);
router.get("/ready", getReady);
router.use("/api/v1/orders", orderRoutes);

module.exports = router;
