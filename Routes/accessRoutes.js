const express = require("express");
const { checkAccess } = require("../Controllers/accessController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.get("/check/:itemId", authMiddleware, checkAccess);

module.exports = router;