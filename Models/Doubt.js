const mongoose = require("mongoose");

const DoubtSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true }, // kis topic/subject ka doubt hai
        description: { type: String, required: true }, // doubt detail
        solution: { type: String }, // admin ka reply
        status: { type: String, enum: ["unsolved", "resolved"], default: "unsolved" }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Doubt", DoubtSchema);
