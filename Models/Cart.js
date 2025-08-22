const mongoose = require("mongoose");

const comboItemSchema = new mongoose.Schema(
  {
    itemType: {
      type: String,
      enum: ["course", "pyq", "testSeries", "book", "combo"],
      required: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    quantity: { type: Number, default: 1 },
  },
  { _id: false }
);

const cartItemSchema = new mongoose.Schema(
  {
    itemType: {
      type: String,
      enum: ["course", "pyq", "testSeries", "book","combo"],
      required: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    quantity: { type: Number, default: 1 },
    comboItems: [comboItemSchema],
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
