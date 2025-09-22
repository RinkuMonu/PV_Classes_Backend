const express = require("express");
const router = express.Router();
const subjectController = require("../Controllers/subject");
const uploadNotes = require("../middleware/notesMiddleware");

// Subject CRUD
router.post("/", subjectController.createSubject); // Create Subject
router.get("/", subjectController.getAllSubjects); // Get all subjects

router.put("/:subjectId", subjectController.updateSubject); // Update subject
router.delete("/:subjectId", subjectController.deleteSubject); // Delete subject

router.post("/assign", subjectController.assignSubjectToCourse); // Assign subject to course
router.get("/course/:courseId", subjectController.getSubjectsByCourse); // Get subjects by course

// Video + Notes
router.post(
  "/:subjectId/videos",
  uploadNotes.array("notes", 5), // field name = "notes"
  subjectController.uploadVideoWithNotes
);


router.put(
  "/:subjectId/videos/:videoIndex",
  uploadNotes.array("notes", 5),
  subjectController.updateVideoSimple
);



module.exports = router;