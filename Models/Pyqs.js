const mongoose = require('mongoose');

const PYQSchema = new mongoose.Schema({
    exam: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    pdfUrl: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ["free", "paid"],
        default: "free",
        required: false
    }
}, { timestamps: true });

module.exports = mongoose.model('PYQ', PYQSchema);
