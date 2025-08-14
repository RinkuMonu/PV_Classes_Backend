const Course = require("../Models/Course");

exports.createCourse = async (req, res) => {
  try {
    const { title, slug, exam, type, price, isFree, overview, status } = req.body;

    let courseData = { title, slug, exam, type, price, isFree, overview, status };

    // Agar multiple files upload hui hain
    if (req.files && req.files.length > 0) {
      courseData.images = req.files.map(file => `${file.filename}`);
    }
    // Image
    // if (req.files && req.files.image && req.files.image.length > 0) {
    //   courseData.image = req.files.image[0].path; // Cloudinary URL
    // }

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

    if (title) filter.title = { $regex: title, $options: "i" };
    if (exam) filter.exam = exam;
    if (type) filter.type = type;
    if (status) filter.status = status;

    let query = Course.find(filter);
    if (viewAll !== "true") query = query.limit(5);

    const courses = await query;
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
    const { title, description, order, duration, youtubeUrl } = req.body;
    const courseId = req.params.courseId;

    // Course find karein
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Video ka final URL decide karein
    let videoUrl = null;
    let sourceType = null; // optional: track karein kis source ka video hai

    if (req.file) {
      // Agar admin ne file upload ki hai → Cloudinary ka URL save karein
      videoUrl = req.file.path;
      sourceType = "cloudinary";
    } else if (youtubeUrl) {
      // Agar file nahi hai lekin YouTube URL hai → YouTube ka URL save karein
      videoUrl = youtubeUrl;
      sourceType = "youtube";
    }

    if (!videoUrl) {
      return res.status(400).json({ message: "Please upload a video or provide a YouTube URL" });
    }

    // New video object push karein
    course.videos.push({
      title: title || `Part ${course.videos.length + 1}`,
      url: videoUrl,
      description: description || "",
      duration: duration ? Number(duration) : null,
      order: order ? Number(order) : course.videos.length + 1,
      sourceType // optional field
    });

    // Order ke according sort karein
    course.videos.sort((a, b) => a.order - b.order);

    await course.save();

    res.status(200).json({
      message: "Video added successfully",
      video: course.videos[course.videos.length - 1],
      course
    });
  } catch (error) {
    res.status(500).json({
      message: "Video upload failed",
      error: error.message
    });
  }
};
