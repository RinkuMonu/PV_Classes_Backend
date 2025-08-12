const CourseDetails = require("../Models/CourseDetails");

exports.addCourseDetails = async (req, res) => {
    try {
        const { course, language, offerings, faculty } = req.body;

        // Convert string or single values into arrays
        const parsedLanguage = language ? (Array.isArray(language) ? language : [language]) : [];
        const parsedOfferings = offerings ? (Array.isArray(offerings) ? offerings : [offerings]) : [];

        // Parse faculty JSON array
        let parsedFaculty = [];
        if (faculty) {
            parsedFaculty = typeof faculty === "string" ? JSON.parse(faculty) : faculty;
        }

        // Handle faculty images from multer
        if (req.files && req.files.length > 0) {
            req.files.forEach((file, index) => {
                if (parsedFaculty[index]) {
                    parsedFaculty[index].avatar = `/uploads/coursefaculty/${file.filename}`;
                }
            });
        }

        // Save to DB
        const newDetails = new CourseDetails({
            course,
            language: parsedLanguage,
            offerings: parsedOfferings,
            faculty: parsedFaculty
        });

        await newDetails.save();

        res.status(201).json({
            message: "Course details added successfully",
            data: newDetails
        });

    } catch (error) {
        res.status(500).json({ message: "Error adding course details", error: error.message });
    }
};

exports.getCourseDetailsById = async (req, res) => {
    try {
        const { id } = req.params;
        const details = await CourseDetails.findOne({ course: id }).populate("course");

        if (!details) {
            return res.status(404).json({ message: "No course details found" });
        }

        res.status(200).json(details);
    } catch (error) {
        res.status(500).json({ message: "Error fetching course details", error: error.message });
    }
};
