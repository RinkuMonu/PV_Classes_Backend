const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer-Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        if (!req.params.courseId) {
            throw new Error("Course ID is required in the URL");
        }
        return {
            folder: `courses/${req.params.courseId}/videos`, // ✅ unique per course
            resource_type: "video",
            allowed_formats: ["mp4", "mov", "avi", "mkv"],
            public_id: Date.now() + "-" + file.originalname.split(".")[0],
        };
    },
});

const uploadVideo = multer({ storage });

module.exports = uploadVideo;