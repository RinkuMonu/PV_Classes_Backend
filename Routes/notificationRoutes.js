const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");
const { setPreferences, createNotification, getUserNotifications, getAllNotifications } = require("../Controllers/notificationController");

router.post("/set", authMiddleware, setPreferences);

router.post("/", authMiddleware, createNotification);

router.get("/", authMiddleware, getUserNotifications);

router.get("/all", authMiddleware, getAllNotifications);
module.exports = router;