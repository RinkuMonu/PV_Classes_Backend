const mongoose = require("mongoose");

const UserPreferenceSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
        categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }] // agar empty hai => sab categories allowed
    },
    { timestamps: true }
);

module.exports = mongoose.model("UserPreference", UserPreferenceSchema);