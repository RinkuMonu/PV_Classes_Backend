// const Course = require("../Models/Course");

// exports.createCourse = async (req, res) => {
//   try {
//     const { title, slug, exam, type, price, isFree, overview, status } = req.body;

//     let courseData = { title, slug, exam, type, price, isFree, overview, status };

//     // Agar multiple files upload hui hain
//     if (req.files && req.files.length > 0) {
//       courseData.images = req.files.map(file => `${file.filename}`);
//     }
//     // Image
//     // if (req.files && req.files.image && req.files.image.length > 0) {
//     //   courseData.image = req.files.image[0].path; // Cloudinary URL
//     // }

//     // Videos
//     if (req.files && req.files.videos && req.files.videos.length > 0) {
//       courseData.videos = req.files.videos.map(file => file.path); // Array of URLs
//     }

//     const newCourse = new Course(courseData);
//     await newCourse.save();

//     res.status(201).json({
//       message: "Course created successfully",
//       course: newCourse
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error creating course",
//       error: error.message
//     });
//   }
// };



// Get all courses with filters
// exports.getCourses = async (req, res) => {
//   try {
//     const { title, type, status, viewAll, exam } = req.query;

//     let filter = {};

//     if (title) filter.title = { $regex: title, $options: "i" };
//     if (exam) filter.exam = exam;
//     if (type) filter.type = type;
//     if (status) filter.status = status;

//     let query = Course.find(filter);
//     if (viewAll !== "true") query = query.limit(5);

//     const courses = await query;
//     res.status(200).json(courses);

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


// // Get course by ID
// exports.getCourseById = async (req, res) => {
//   try {
//     const course = await Course.findById(req.params.id).populate("exam");
//     if (!course) return res.status(404).json({ message: "Course not found" });
//     res.status(200).json(course);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching course", error: error.message });
//   }
// };

// // Update course
// exports.updateCourse = async (req, res) => {
//   try {
//     const courseData = req.body;

//     if (req.file) {
//       courseData.image = `/uploads/course/${req.file.filename}`;
//     }

//     const course = await Course.findByIdAndUpdate(req.params.id, courseData, { new: true });
//     if (!course) return res.status(404).json({ message: "Course not found" });

//     res.status(200).json({
//       message: "Course updated successfully",
//       course,
//     });
//   } catch (error) {
//     res.status(400).json({
//       message: "Error updating course",
//       error: error.message,
//     });
//   }
// };

// // Delete course
// exports.deleteCourse = async (req, res) => {
//   try {
//     const course = await Course.findByIdAndDelete(req.params.id);
//     if (!course) return res.status(404).json({ message: "Course not found" });
//     res.status(200).json({ message: "Course deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting course", error: error.message });
//   }
// };

// exports.uploadCourseVideo = async (req, res) => {
//   try {
//     const { title, description, order, duration, youtubeUrl } = req.body;
//     const courseId = req.params.courseId;

//     // Course find karein
//     const course = await Course.findById(courseId);
//     if (!course) {
//       return res.status(404).json({ message: "Course not found" });
//     }

//     // Video ka final URL decide karein
//     let videoUrl = null;
//     let sourceType = null; // optional: track karein kis source ka video hai

//     if (req.file) {
//       // Agar admin ne file upload ki hai → Cloudinary ka URL save karein
//       videoUrl = req.file.path;
//       sourceType = "cloudinary";
//     } else if (youtubeUrl) {
//       // Agar file nahi hai lekin YouTube URL hai → YouTube ka URL save karein
//       videoUrl = youtubeUrl;
//       sourceType = "youtube";
//     }

//     if (!videoUrl) {
//       return res.status(400).json({ message: "Please upload a video or provide a YouTube URL" });
//     }

//     // New video object push karein
//     course.videos.push({
//       title: title || `Part ${course.videos.length + 1}`,
//       url: videoUrl,
//       description: description || "",
//       duration: duration ? Number(duration) : null,
//       order: order ? Number(order) : course.videos.length + 1,
//       sourceType // optional field
//     });

//     // Order ke according sort karein
//     course.videos.sort((a, b) => a.order - b.order);

//     await course.save();

//     res.status(200).json({
//       message: "Video added successfully",
//       video: course.videos[course.videos.length - 1],
//       course
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Video upload failed",
//       error: error.message
//     });
//   }
// };
const Course = require("../Models/Course");

// 📌 Create Course
exports.createCourse = async (req, res) => {
  try {
    const {
      title, slug, exam, type, author, language, mainMotive, topics, features,
      price, discount_price, isFree, validity,
      shortDescription, longDescription, status,
      comboItems, videos // 👈 added videos
    } = req.body;

    let courseData = {
      title, slug, exam, type, author, language,
      mainMotive, price, discount_price,
      isFree, validity, shortDescription,
      longDescription, status
    };

    if (topics) courseData.topics = Array.isArray(topics) ? topics : topics.split(",");
    if (features) courseData.features = Array.isArray(features) ? features : features.split(",");

    // Images upload
    if (req.files && req.files.length > 0) {
      courseData.images = req.files.map(file => `${file.filename}`);
    }

    // 👇 Combo Items add
    if (comboItems) {
      courseData.comboItems = JSON.parse(comboItems);
    }

    // 👇 Videos add
    if (videos) {
      courseData.videos = JSON.parse(videos);
    }

    const newCourse = new Course(courseData);
    await newCourse.save();

    res.status(201).json({ message: "Course created successfully", course: newCourse });
  } catch (error) {
    res.status(500).json({ message: "Error creating course", error: error.message });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const { title, type, status, viewAll, exam } = req.query;
    let filter = {};
    if (title) filter.title = { $regex: title, $options: "i" };
    if (exam) filter.exam = exam;
    if (type) filter.type = type;
    if (status) filter.status = status;

    let query = Course.find(filter)
      .populate("exam")
      .populate("author", "name experience profile_image_url specialization")
      .populate("comboItems.itemId"); // 👈 populate combo items

    if (viewAll !== "true") query = query.limit(20);

    let courses = await query;

    // 👇 Add finalPrice for each course
    courses = courses.map(course => {
      let finalPrice = course.price || 0;

      if (course.comboItems && course.comboItems.length > 0) {
        course.comboItems.forEach(item => {
          if (item.type === "Book" && item.itemId) {
            finalPrice += item.itemId.discount_price > 0 ? item.itemId.discount_price : item.itemId.price;
          }
          if (item.type === "TestSeries" && item.itemId) {
            finalPrice += item.itemId.discount_price > 0 ? item.itemId.discount_price : item.itemId.price;
          }
          if (item.type === "PYQ" && item.itemId) {
            finalPrice += item.itemId.finalPrice || item.itemId.price;
          }
        });
      }

      return { ...course.toObject(), finalPrice };
    });

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Get Course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("exam")
      .populate("author", "name experience profile_image_url specialization")
      .populate("comboItems.itemId");

    if (!course) return res.status(404).json({ message: "Course not found" });

    // 👇 Final price calculation
    let finalPrice = course.price || 0;

    if (course.comboItems && course.comboItems.length > 0) {
      course.comboItems.forEach(item => {
        if (item.type === "Book" && item.itemId) {
          finalPrice += item.itemId.discount_price > 0 ? item.itemId.discount_price : item.itemId.price;
        }
        if (item.type === "TestSeries" && item.itemId) {
          finalPrice += item.itemId.discount_price > 0 ? item.itemId.discount_price : item.itemId.price;
        }
        if (item.type === "PYQ" && item.itemId) {
          finalPrice += item.itemId.finalPrice || item.itemId.price;
        }
      });
    }

    res.status(200).json({ ...course.toObject(), finalPrice });
  } catch (error) {
    res.status(500).json({ message: "Error fetching course", error: error.message });
  }
};

// 📌 Update Course
exports.updateCourse = async (req, res) => {
  try {
    let courseData = req.body;
    if (req.file) {
      courseData.image = `/uploads/course/${req.file.filename}`;
    }
    if (courseData.topics) {
      courseData.topics = Array.isArray(courseData.topics) ? courseData.topics : courseData.topics.split(",");
    }
    if (courseData.features) {
      courseData.features = Array.isArray(courseData.features) ? courseData.features : courseData.features.split(",");
    }

    const course = await Course.findByIdAndUpdate(req.params.id, courseData, { new: true });
    if (!course) return res.status(404).json({ message: "Course not found" });

    res.status(200).json({ message: "Course updated successfully", course });
  } catch (error) {
    res.status(400).json({ message: "Error updating course", error: error.message });
  }
};

// 📌 Delete Course
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
    const { title, shortDescription, longDescription, order, duration, url, isFree } = req.body;
    const courseId = req.params.courseId;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    // Validate order number
    const videoOrder = order ? Number(order) : course.videos.length + 1;
    const orderExists = course.videos.some(v => v.order === videoOrder);
    if (orderExists) {
      return res.status(400).json({ message: `Order ${videoOrder} already exists for this course` });
    }
    let videoUrl = null;
    let sourceType = null;

    if (req.file) {
      videoUrl = req.file.path;
      sourceType = "cloudinary";
    } else if (url) {
      videoUrl = url;
      sourceType = "youtube";
    }

    if (!videoUrl) {
      return res.status(400).json({ message: "Please upload a video or provide a YouTube URL" });
    }

    course.videos.push({
      title: title || `Part ${course.videos.length + 1}`,
      url: videoUrl,
      duration: duration ? Number(duration) : null,
      order: order ? Number(order) : course.videos.length + 1,
      isFree: isFree === "true",
      shortDescription: shortDescription,
      longDescription: longDescription,
      sourceType
    });

    course.videos.sort((a, b) => a.order - b.order);
    await course.save();

    res.status(200).json({ message: "Video added successfully", course });
  } catch (error) {
    res.status(500).json({ message: "Video upload failed", error: error.message });
  }
};

exports.updateCourseVideo = async (req, res) => {
  try {
    const { courseId, videoId } = req.params;
    const { title, description, shortDescription, longDescription, order, duration, url, isFree } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const video = course.videos.id(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // If order is being changed, validate uniqueness
    if (order && Number(order) !== video.order) {
      const orderExists = course.videos.some(v => v.order === Number(order));
      if (orderExists) {
        return res.status(400).json({ message: `Order ${order} already exists for this course` });
      }
      video.order = Number(order);
    }

    // File upload or YouTube link
    if (req.file) {
      video.url = req.file.path;
      video.sourceType = "cloudinary";
    } else if (url) {
      video.url = url;
      video.sourceType = "youtube";
    }

    // Update only provided fields
    if (title) video.title = title;
    if (description) video.description = description;
    if (shortDescription) video.shortDescription = shortDescription;
    if (longDescription) video.longDescription = longDescription;
    if (duration) video.duration = Number(duration);
    if (typeof isFree !== "undefined") video.isFree = isFree === "true" || isFree === true;

    // Sort by order after update
    course.videos.sort((a, b) => a.order - b.order);

    await course.save();

    res.status(200).json({ message: "Video updated successfully", course });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Video update failed", error: error.message });
  }
};

