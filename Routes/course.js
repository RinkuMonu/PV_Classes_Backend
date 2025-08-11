const express = require("express");
const router = express.Router();
const courseController = require("../Controllers/course");

// Create
router.post("/", courseController.createCourse);

// Read all
router.get("/", courseController.getCourses);

// Read by ID
router.get("/:id", courseController.getCourseById);

// Update
router.put("/:id", courseController.updateCourse);

// Delete
router.delete("/:id", courseController.deleteCourse);

module.exports = router;
