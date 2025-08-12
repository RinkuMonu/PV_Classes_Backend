const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const examController = require("../Controllers/exam");

// Ensure uploads/exam folder exists
const uploadPath = path.join(__dirname, "../uploads/exam");
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

// File filter to allow ALL common image formats
const fileFilter = (req, file, cb) => {
    const allowedExtensions = /\.(jpg|jpeg|png|gif|bmp|tiff|webp|heic)$/i;
    if (allowedExtensions.test(file.originalname)) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed (jpg, jpeg, png, gif, bmp, tiff, webp, heic)."), false);
    }
};

const upload = multer({
    storage,
    fileFilter
});

// Create Exam (with image)
router.post("/", upload.single("image"), examController.createExam);

// Read all Exams
router.get("/", examController.getExams);

// Get exams by examType
router.get("/type/:examTypeId", examController.getExamsByType);

// Read Exam by ID
router.get("/:id", examController.getExamById);

// Update Exam (with optional new image)
router.put("/:id", upload.single("image"), examController.updateExam);

// Delete Exam
router.delete("/:id", examController.deleteExam);

module.exports = router;
