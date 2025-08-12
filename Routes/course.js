const express = require("express");
const router = express.Router();
const courseController = require("../Controllers/course");
const upload = require("../middleware/upload");

// Middleware to set subFolder before upload
function setCourseUploadFolder(req, res, next) {
    req.subFolder = "course"; // store in uploads/course
    next();
}

// Create course with file upload
router.post(
    "/",
    setCourseUploadFolder,
    upload.single("courseImage"), // field name in form-data
    courseController.createCourse
);

// Get all courses
router.get("/", courseController.getCourses);

// Get course by ID
router.get("/:id", courseController.getCourseById);

// Update course with file upload
router.put(
    "/:id",
    setCourseUploadFolder,
    upload.single("courseImage"),
    courseController.updateCourse
);

// Delete course
router.delete("/:id", courseController.deleteCourse);

module.exports = router;
