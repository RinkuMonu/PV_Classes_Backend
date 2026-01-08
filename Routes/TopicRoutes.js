// routes/topicRoutes.js
const express = require("express");
const router = express.Router();
const {
  createTopic,
  getTopics,
  getTopicsByBatch,
  getTopicById,
  updateTopic,
  deleteTopic,
} = require("../Controllers/topicController");

// const { authorizeRoles } = require("../middleware/authMiddleware");
// const { protect } = require("../middleware/protectMiddleware");


router.post("/", createTopic);
router.get("/list", getTopics);
router.get("/by-batch/:batchId", getTopicsByBatch);
router.get("/:id", getTopicById);
router.put("/:id", updateTopic);
router.delete("/:id", deleteTopic);

module.exports = router;
