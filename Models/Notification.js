const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }, // kis category ka notification hai
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // admin jisne create kiya
    },
    { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);