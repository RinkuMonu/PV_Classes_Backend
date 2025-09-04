const express = require("express");
const router = express.Router();
const { getCounts } = require("../Controllers/CountController");

// GET: /api/stats/counts
router.get("/", getCounts);

module.exports = router;
