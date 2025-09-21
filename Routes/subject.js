const express = require("express");
const router = express.Router();
const subjectController = require("../Controllers/subject");
const uploadNotes = require("../middleware/notesMiddleware");

// Subject CRUD
router.post("/", subjectController.createSubject); // Create Subject
router.get("/", subjectController.getAllSubjects); // Get all subjects
router.post("/assign", subjectController.assignSubjectToCourse); // Assign subject to course
router.get("/course/:courseId", subjectController.getSubjectsByCourse); // Get subjects by course

// Video + Notes
router.post("/:subjectId/videos", uploadNotes.array("notes", 5), subjectController.uploadVideoWithNotes);

module.exports = router;