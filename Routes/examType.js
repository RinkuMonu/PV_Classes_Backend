const express = require("express");
const router = express.Router();
const examTypeController = require("../Controllers/examType");

// Create
router.post("/", examTypeController.createExamType);

// Read all
router.get("/", examTypeController.getExamTypes);

router.get("/category/:categoryId", examTypeController.getExamTypesByCategory);

// Read by ID
router.get("/:id", examTypeController.getExamTypeById);

// Update
router.put("/:id", examTypeController.updateExamType);

// Delete
router.delete("/:id", examTypeController.deleteExamType);



module.exports = router;
