// controllers/topicController.js
const Topic = require("../Models/TopicModel");

// Create Topic
exports.createTopic = async (req, res) => {
  try {
    const topic = await Topic.create(req.body);
    res.status(201).json(topic);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all Topics
exports.getTopics = async (req, res) => {
  try {
    const topics = await Topic.find()
      .populate("batch")
      .sort({ order: 1, createdAt: -1 });
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Topics by Batch
exports.getTopicsByBatch = async (req, res) => {
  try {
    const topics = await Topic.find({ batch: req.params.batchId })
      .populate("batch")
      .sort({ order: 1, createdAt: -1 });
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single Topic
exports.getTopicById = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id).populate("batch");
    if (!topic) return res.status(404).json({ message: "Topic not found" });
    res.json(topic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Topic
exports.updateTopic = async (req, res) => {
  try {
    const topic = await Topic.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!topic) return res.status(404).json({ message: "Topic not found" });
    res.json(topic);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Topic
exports.deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findByIdAndDelete(req.params.id);
    if (!topic) return res.status(404).json({ message: "Topic not found" });
    res.json({ message: "Topic deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
