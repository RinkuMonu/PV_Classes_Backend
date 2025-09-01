const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");
const { setPreferences, createNotification, getUserNotifications } = require("../Controllers/NotificationController");

router.post("/set", authMiddleware, setPreferences);

router.post("/", authMiddleware, createNotification);

router.get("/", authMiddleware, getUserNotifications);

module.exports = router;