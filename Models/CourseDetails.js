const mongoose = require("mongoose");

const CourseDetailsSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    language: [
        { type: String }
    ],
    offerings: [
        { type: String }
    ],
    faculty: [
        {
            name: { type: String, required: true },
            experience: { type: String, required: true },
            avatar: { type: String } // image path from multer
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("CourseDetails", CourseDetailsSchema);