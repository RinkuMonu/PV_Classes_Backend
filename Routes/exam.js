const express = require("express");
const router = express.Router();
const examController = require("../Controllers/exam");

// Create
router.post("/", examController.createExam);

// Read all
router.get("/", examController.getExams);

// Read by ID
router.get("/:id", examController.getExamById);

// Update
router.put("/:id", examController.updateExam);

// Delete
router.delete("/:id", examController.deleteExam);

module.exports = router;
