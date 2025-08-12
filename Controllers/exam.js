const Exam = require("../Models/Exam");
const fs = require("fs");
const path = require("path");

exports.createExam = async (req, res) => {
    try {
        const data = req.body;

        if (req.file) {
            data.logo = `/uploads/exam/${req.file.filename}`;
        }

        const exam = await Exam.create(data);
        res.status(201).json({ message: "Exam created successfully", exam });
    } catch (error) {
        res.status(400).json({ message: "Error creating exam", error: error.message });
    }
};

exports.getExams = async (req, res) => {
    try {
        const exams = await Exam.find().populate("examType").sort({ createdAt: -1 });
        res.status(200).json(exams);
    } catch (error) {
        res.status(500).json({ message: "Error fetching exams", error: error.message });
    }
};

exports.getExamsByType = async (req, res) => {
    try {
        const { examTypeId } = req.params;

        const exams = await Exam.find({ examType: examTypeId })
            .populate("examType")
            .sort({ createdAt: -1 });

        if (!exams.length) {
            return res.status(404).json({ message: "No exams found for this exam type" });
        }

        res.status(200).json(exams);
    } catch (error) {
        res.status(500).json({ message: "Error fetching exams by type", error: error.message });
    }
};

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
        const data = req.body;

        // If a new image is uploaded
        if (req.file) {
            data.logo = `/uploads/exam/${req.file.filename}`;

            // Delete old image if exists
            const existingExam = await Exam.findById(req.params.id);
            if (existingExam && existingExam.logo) {
                const oldPath = path.join(__dirname, `..${existingExam.logo}`);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
        }

        const exam = await Exam.findByIdAndUpdate(req.params.id, data, { new: true });
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

        // Delete image file if exists
        if (exam && exam.logo) {
            const oldPath = path.join(__dirname, `..${exam.logo}`);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        if (!exam) return res.status(404).json({ message: "Exam not found" });
        res.status(200).json({ message: "Exam deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting exam", error: error.message });
    }
};
