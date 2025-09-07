// const mongoose = require("mongoose");

// const FacultySchema = new mongoose.Schema(
//     {
//         name: { type: String, required: true },
//         experience: { type: String },
//         specialization: { type: String },
//         photo: { type: String } // store image path or URL
//     },
//     { timestamps: true }
// );

// module.exports = mongoose.model("Faculty", FacultySchema);


const mongoose = require("mongoose");

const FacultySchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        experience: { type: String },
        specialization: { type: String },
        photo: { type: String }, // store image path or URL
        demoVideo: { type: String } // new field for demo video URL
    },
    { timestamps: true }
);

module.exports = mongoose.model("Faculty", FacultySchema);