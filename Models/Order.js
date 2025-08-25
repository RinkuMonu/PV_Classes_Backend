const mongoose = require("mongoose");

// const AddressSchema = new mongoose.Schema({
//     street: { type: String, required: true },
//     city: { type: String, required: true },
//     state: { type: String, required: true },
//     postalCode: { type: String, required: true },
//     country: { type: String, required: true },
// }, { _id: false });

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // Courses purchase
    courses: [
        {
            course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true }
        }
    ],

    // Books purchase
    books: [
        {
            book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true }
        }
    ],

    // Test Series purchase
    testSeries: [
        {
            test: { type: mongoose.Schema.Types.ObjectId, ref: "TestSeries", required: true }
        }
    ],
    combo:[
        {
            combo: { type: mongoose.Schema.Types.ObjectId, ref: "Combo", required: true }
        }
    ],
    // address: {
    //     type: AddressSchema,
    //     required: true
    // },
    paymentMethod: {
        type: String,
        enum: ["card", "upi", "netbanking", "cod"],
        default: "cod"
    },
    totalAmount: { type: Number, required: true },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
    },
    orderStatus: {
        type: String,
        enum: ["processing", "completed", "cancelled"],
        default: "processing"
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", OrderSchema);
