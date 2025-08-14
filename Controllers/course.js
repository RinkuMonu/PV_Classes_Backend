const Course = require("../Models/Course");

exports.createCourse = async (req, res) => {
  try {
    const { title, slug, exam, type, price, isFree, overview, status } = req.body;

    let courseData = { title, slug, exam, type, price, isFree, overview, status };

    // Image
    if (req.files && req.files.image && req.files.image.length > 0) {
      courseData.image = req.files.image[0].path; // Cloudinary URL
    }

    // Videos
    if (req.files && req.files.videos && req.files.videos.length > 0) {
      courseData.videos = req.files.videos.map(file => file.path); // Array of URLs
    }

    const newCourse = new Course(courseData);
    await newCourse.save();

    res.status(201).json({
      message: "Course created successfully",
      course: newCourse
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating course",
      error: error.message
    });
  }
};

// Get all courses with filters
// exports.getCourses = async (req, res) => {
//   try {
//     const { title, type, status, viewAll } = req.query;

//     let filter = {};

//     // Search by title (case-insensitive)
//     if (title) {
//       filter.title = { $regex: title, $options: "i" };
//     }

//     // Optional filters
//     if (type) {
//       filter.type = type;
//     }
//     if (status) {
//       filter.status = status;
//     }

//     let courses;

//     if (viewAll === "true") {
//       // Send all courses
//       courses = await Course.find(filter);
//     } else {
//       // Send only 5 courses
//       courses = await Course.find(filter).limit(5);
//     }

//     res.status(200).json(courses);

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Get all courses with filters
exports.getCourses = async (req, res) => {
  try {
    const { title, type, status, viewAll, exam } = req.query;

    let filter = {};

    // Search by title (case-insensitive)
    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }

    // Filter by exam ID
    if (exam) {
      filter.exam = exam;
    }

    // Optional filters
    if (type) {
      filter.type = type;
    }
    if (status) {
      filter.status = status;
    }

    let courses;

    if (viewAll === "true") {
      // Send all courses
      courses = await Course.find(filter);
    } else {
      // Send only 5 courses
      courses = await Course.find(filter).limit(5);
    }

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("exam");
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: "Error fetching course", error: error.message });
  }
};

// Update course
exports.updateCourse = async (req, res) => {
  try {
    const courseData = req.body;

    if (req.file) {
      courseData.image = `/uploads/course/${req.file.filename}`;
    }

    const course = await Course.findByIdAndUpdate(req.params.id, courseData, { new: true });
    if (!course) return res.status(404).json({ message: "Course not found" });

    res.status(200).json({
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error updating course",
      error: error.message,
    });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting course", error: error.message });
  }
};

exports.uploadCourseVideo = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    if (!req.file) {
      return res.status(400).json({ message: "No video file uploaded" });
    }

    // Cloudinary URL
    const videoUrl = req.file.path;

    // Optionally: Save video URL to course in DB
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // If you want multiple videos
    if (!course.videos) {
      course.videos = [];
    }
    course.videos.push(videoUrl);

    await course.save();

    res.status(200).json({
      message: "Video uploaded successfully",
      videoUrl,
      course
    });
  } catch (error) {
    res.status(500).json({
      message: "Video upload failed",
      error: error.message
    });
  }
};