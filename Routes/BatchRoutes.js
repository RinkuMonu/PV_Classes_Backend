// routes/batchRoutes.js
const express = require("express");
const router = express.Router();
const {
  createBatch,
  getBatches,
  getBatchesByCourse,
  getBatchById,
  updateBatch,
  deleteBatch,
} = require("../Controllers/BatchController");

// const { protect, authorizeRoles } = require("../middleware/auth");


router.post("/", createBatch);
router.get("/list", getBatches);
router.get("/by-course/:courseId", getBatchesByCourse);
router.get("/:id", getBatchById);
router.put("/:id", updateBatch);
router.delete("/:id", deleteBatch);

module.exports = router;
