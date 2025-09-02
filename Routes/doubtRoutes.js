const express = require("express");
const { createDoubt, solveDoubt, getDoubtById, getUserDoubts, getAllDoubts, getDoubtHistory } = require("../Controllers/doubtController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.post("/create", authMiddleware, createDoubt);
router.get("/my-doubts", authMiddleware, getUserDoubts);
router.get("/all", getAllDoubts);
router.get("/his", authMiddleware, getDoubtHistory);
router.post("/solve/:doubtId", solveDoubt);
router.get("/:id", getDoubtById);
module.exports = router;
