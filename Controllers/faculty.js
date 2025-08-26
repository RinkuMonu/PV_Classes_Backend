const Faculty = require("../Models/faculty");
const Course = require("../Models/Course");

// Create Faculty
exports.createFaculty = async (req, res) => {
  try {
    const { name, experience, specialization } = req.body;
    let photo = null;
    if (req.file) {
      photo = `/uploads/faculty/${req.file.filename}`;
    }

    const faculty = new Faculty({ name, experience, specialization, photo });
    await faculty.save();
    res.status(201).json({ message: "Faculty created", faculty });
  } catch (error) {
    res.status(500).json({ message: "Error creating faculty", error: error.message });
  }
};

// Get All Faculty
exports.getAllFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find();
    res.status(200).json(faculty);
  } catch (error) {
    res.status(500).json({ message: "Error fetching faculty", error: error.message });
  }
};

// Add Faculty to Course
exports.addFacultyToCourse = async (req, res) => {
  try {
    const { courseId, facultyId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (!course.faculty.includes(facultyId)) {
      course.faculty.push(facultyId);
      await course.save();
    }

    res.status(200).json({ message: "Faculty added to course", course });
  } catch (error) {
    res.status(500).json({ message: "Error adding faculty to course", error: error.message });
  }
};