// const mongoose = require("mongoose");

// const cartItemSchema = new mongoose.Schema({
//     itemType: {
//         type: String,
//         enum: ["course", "pyq", "testSeries", "book"],
//         required: true
//     },
//     itemId: {
//         type: mongoose.Schema.Types.ObjectId,
//         required: true
//     },
//     quantity: { type: Number, default: 1 },
//     extra: { type: Object } // Can hold delivery details for books
// }, { _id: false });

// const cartSchema = new mongoose.Schema({
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     items: [cartItemSchema]
// }, { timestamps: true });

// module.exports = mongoose.model("Cart", cartSchema);