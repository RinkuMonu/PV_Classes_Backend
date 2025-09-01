const express = require("express");
const { createDoubt, solveDoubt, getUserDoubts, getAllDoubts } = require("../Controllers/doubtController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// User routes
router.post("/create", authMiddleware, createDoubt); // user creates doubt
router.get("/my-doubts", authMiddleware, getUserDoubts); // user gets his doubts

// Admin routes
router.get("/all", authMiddleware, getAllDoubts); // admin sees all doubts
router.post("/solve/:doubtId", authMiddleware, solveDoubt); // admin solves doubt

module.exports = router;
