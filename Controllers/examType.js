const ExamType = require("../Models/ExamType");

// Create exam type
exports.createExamType = async (req, res) => {
  try {
    const examType = await ExamType.create(req.body);
    res.status(201).json({ message: "Exam type created successfully", examType });
  } catch (error) {
    res.status(400).json({ message: "Error creating exam type", error: error.message });
  }
};

// Get all exam types
exports.getExamTypes = async (req, res) => {
  try {
    const examTypes = await ExamType.find().populate("category").sort({ createdAt: -1 });
    res.status(200).json(examTypes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching exam types", error: error.message });
  }
};

// Get exam type by ID
exports.getExamTypeById = async (req, res) => {
  try {
    const examType = await ExamType.findById(req.params.id).populate("category");
    if (!examType) return res.status(404).json({ message: "Exam type not found" });
    res.status(200).json(examType);
  } catch (error) {
    res.status(500).json({ message: "Error fetching exam type", error: error.message });
  }
};

// Update exam type
exports.updateExamType = async (req, res) => {
  try {
    const examType = await ExamType.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!examType) return res.status(404).json({ message: "Exam type not found" });
    res.status(200).json({ message: "Exam type updated successfully", examType });
  } catch (error) {
    res.status(400).json({ message: "Error updating exam type", error: error.message });
  }
};

// Delete exam type
exports.deleteExamType = async (req, res) => {
  try {
    const examType = await ExamType.findByIdAndDelete(req.params.id);
    if (!examType) return res.status(404).json({ message: "Exam type not found" });
    res.status(200).json({ message: "Exam type deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting exam type", error: error.message });
  }
};
