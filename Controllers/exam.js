const Exam = require("../Models/Exam");

// Create exam
exports.createExam = async (req, res) => {
    try {
        const exam = await Exam.create(req.body);
        res.status(201).json({ message: "Exam created successfully", exam });
    } catch (error) {
        res.status(400).json({ message: "Error creating exam", error: error.message });
    }
};

// Get all exams
exports.getExams = async (req, res) => {
    try {
        const exams = await Exam.find().populate("examType").sort({ createdAt: -1 });
        res.status(200).json(exams);
    } catch (error) {
        res.status(500).json({ message: "Error fetching exams", error: error.message });
    }
};

// Get exam by ID
exports.getExamById = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id).populate("examType");
        if (!exam) return res.status(404).json({ message: "Exam not found" });
        res.status(200).json(exam);
    } catch (error) {
        res.status(500).json({ message: "Error fetching exam", error: error.message });
    }
};

// Update exam
exports.updateExam = async (req, res) => {
    try {
        const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!exam) return res.status(404).json({ message: "Exam not found" });
        res.status(200).json({ message: "Exam updated successfully", exam });
    } catch (error) {
        res.status(400).json({ message: "Error updating exam", error: error.message });
    }
};

// Delete exam
exports.deleteExam = async (req, res) => {
    try {
        const exam = await Exam.findByIdAndDelete(req.params.id);
        if (!exam) return res.status(404).json({ message: "Exam not found" });
        res.status(200).json({ message: "Exam deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting exam", error: error.message });
    }
};
