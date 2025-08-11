const Course = require("../Models/Course");

// Create course
exports.createCourse = async (req, res) => {
    try {
        const course = await Course.create(req.body);
        res.status(201).json({ message: "Course created successfully", course });
    } catch (error) {
        res.status(400).json({ message: "Error creating course", error: error.message });
    }
};

// Get all courses
// exports.getCourses = async (req, res) => {
//     try {
//         const courses = await Course.find().populate("exam").sort({ createdAt: -1 });
//         res.status(200).json(courses);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching courses", error: error.message });
//     }
// };

// Get all courses with filters
exports.getCourses = async (req, res) => {
    try {
        let filter = {};

        // Filter by exam ID
        if (req.query.exam) {
            filter.exam = req.query.exam;
        }

        // Filter by language (Array allowed)
        if (req.query.language) {
            const langs = req.query.language.split(",");
            filter["details.language"] = { $in: langs };
        }

        // Filter by mode (Free, Paid, All)
        if (req.query.mode && req.query.mode !== "All") {
            if (req.query.mode === "Free") {
                filter.isFree = true;
            } else if (req.query.mode === "Paid") {
                filter.isFree = false;
            }
        }

        // Filter by course type
        if (req.query.type && req.query.type !== "All") {
            const types = req.query.type.split(",");
            filter.type = { $in: types };
        }

        // Status filter (active/inactive)
        if (req.query.status) {
            filter.status = req.query.status;
        }

        // Search by title
        if (req.query.search) {
            filter.title = { $regex: req.query.search, $options: "i" };
        }

        // Pagination params
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Total count for pagination info
        const totalCourses = await Course.countDocuments(filter);

        const courses = await Course.find(filter)
            .populate("exam")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            total: totalCourses,
            page,
            totalPages: Math.ceil(totalCourses / limit),
            courses
        });

    } catch (error) {
        res.status(500).json({ message: "Error fetching courses", error: error.message });
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
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!course) return res.status(404).json({ message: "Course not found" });
        res.status(200).json({ message: "Course updated successfully", course });
    } catch (error) {
        res.status(400).json({ message: "Error updating course", error: error.message });
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
