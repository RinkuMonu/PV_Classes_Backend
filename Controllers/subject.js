const Subject = require("../Models/subject");
const Course = require("../Models/Course");

// Create subject (without course)
exports.createSubject = async (req, res) => {
  try {
    const { title, description } = req.body;

    const subject = new Subject({ title, description });
    await subject.save();

    res.status(201).json({ message: "Subject created successfully", subject });
  } catch (error) {
    res.status(500).json({ message: "Error creating subject", error: error.message });
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
    const course = await Course.findById(courseId).populate("subjects");
    if (!course) return res.status(404).json({ message: "Course not found" });

    res.status(200).json(course.subjects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching subjects", error: error.message });
  }
};

// 📌 Upload Video + Notes (same as before)
exports.uploadVideoWithNotes = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { title, url, duration, order, isFree } = req.body;

    const subject = await Subject.findById(subjectId);
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    let notesFiles = [];
    if (req.files && req.files.length > 0) {
      notesFiles = req.files.map(file => `/uploads/notes/${file.filename}`);
    }

    subject.videos.push({
      title,
      url,
      duration: duration ? Number(duration) : null,
      order: order ? Number(order) : subject.videos.length + 1,
      isFree: isFree === "true",
      notes: notesFiles
    });

    await subject.save();

    res.status(200).json({ message: "Video + Notes added successfully", subject });
  } catch (error) {
    res.status(500).json({ message: "Error uploading video with notes", error: error.message });
  }
};