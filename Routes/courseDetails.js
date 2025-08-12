const express = require("express");
const router = express.Router();
const courseDetailsController = require("../Controllers/courseDetailsController");
const upload = require("../middleware/upload");
const uploadImg = upload("course");

// Add course details (multiple offerings text + faculty images)
router.post("/", (req, res, next) => {
    req.subFolder = "courseDetails"; // faculty images will be stored in /uploads/courseDetails
    next();
}, uploadImg.array("facultyImages"), courseDetailsController.addCourseDetails);

// Get course details by courseId (search)
router.get("/:id", courseDetailsController.getCourseDetailsById);

module.exports = router;