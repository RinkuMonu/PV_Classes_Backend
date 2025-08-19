const mongoose = require("mongoose");

const AccessSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
    testSeries: { type: mongoose.Schema.Types.ObjectId, ref: "TestSeries" },
    validTill: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Access", AccessSchema);