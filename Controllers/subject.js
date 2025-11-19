const Subject = require("../Models/subject");
const Course = require("../Models/Course");

const fs = require("fs");
const path = require("path");

// Create subject (without course)
// Create subject (with course)
exports.createSubject = async (req, res) => {
  try {
    const { title, description, course } = req.body;

    const subject = new Subject({ title, description, course });
    await subject.save();

    res.status(201).json({ message: "Subject created successfully", subject });
  } catch (error) {
    res.status(500).json({ message: "Error creating subject", error: error.message });
  }
};

// Update Subject
exports.updateSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { title, description, course } = req.body;

    const subject = await Subject.findById(subjectId);
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    if (title) subject.title = title;
    if (description) subject.description = description;
    if (course) subject.course = course;

    await subject.save();
    res.status(200).json({ message: "Subject updated successfully", subject });
  } catch (error) {
    res.status(500).json({ message: "Error updating subject", error: error.message });
  }
};

// Delete Subject
exports.deleteSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;

    const subject = await Subject.findByIdAndDelete(subjectId);
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    res.status(200).json({ message: "Subject deleted successfully", subject });
  } catch (error) {
    res.status(500).json({ message: "Error deleting subject", error: error.message });
  }
};


// Assign subject to course
exports.assignSubjectToCourse = async (req, res) => {
  try {
    const { subjectId, courseId } = req.body;

    const subject = await Subject.findById(subjectId);
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    subject.course = courseId;
    await subject.save();

    res.status(200).json({ message: "Subject assigned to course successfully", subject });
  } catch (error) {
    res.status(500).json({ message: "Error assigning subject to course", error: error.message });
  }
};

// 📌 Get All Subjects
exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching subjects", error: error.message });
  }
};

// 📌 Get All Subjects by Course
exports.getSubjectsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Fetch subjects belonging to this course
    const subjects = await Subject.find({ course: courseId });

    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching subjects", error: error.message });
  }
};

// 📌 Upload Video + Notes (same as before)
exports.uploadVideoWithNotes = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { title, url, duration, order, isFree, shortDescription, longDescription } = req.body;

    const subject = await Subject.findById(subjectId);
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    // Handle notes files
    let notesFiles = [];
    if (req.files && req.files.length > 0) {
      notesFiles = req.files.map(file => `/uploads/notes/${file.filename}`);
    }

    // Add video + notes
    subject.videos.push({
      title,
      url,
      duration: duration ? Number(duration) : null,
      order: order ? Number(order) : subject.videos.length + 1,
      isFree: isFree === "true",
      shortDescription,
      longDescription,
      notes: notesFiles
    });

    await subject.save();

    res.status(200).json({ message: "Video + Notes added successfully", subject });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading video with notes", error: error.message });
  }
};


// Update Video inside Subject
exports.updateVideoSimple = async (req, res) => {
  try {
    const { subjectId, videoIndex } = req.params; // videoIndex = 0,1,2,... 
    const { title, url, isFree } = req.body;

    const subject = await Subject.findById(subjectId);
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    if (!subject.videos[videoIndex]) {
      return res.status(404).json({ message: "Video not found at this index" });
    }

    // Update fields if provided
    if (title) subject.videos[videoIndex].title = title;
    if (url) subject.videos[videoIndex].url = url;
    if (isFree !== undefined) subject.videos[videoIndex].isFree = isFree === "true";

    // Update notes files if uploaded
    if (req.files && req.files.length > 0) {
      const notesFiles = req.files.map(file => `/uploads/notes/${file.filename}`);
      subject.videos[videoIndex].notes = notesFiles;
    }

    await subject.save();

    res.status(200).json({ message: "Video updated successfully", video: subject.videos[videoIndex] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating video", error: error.message });
  }
};
