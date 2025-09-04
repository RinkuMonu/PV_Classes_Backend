const User = require("../Models/User");
const Order = require("../Models/Order");
const Course = require("../Models/Course");
const FAQ = require("../Models/FAQ");
const TestSeries = require("../Models/TestSeries");
const Note = require("../Models/Note");
const Doubt = require("../Models/Doubt");

exports.getCounts = async (req, res) => {
    try {
        const [
            totalUsers,
            totalOrders,
            totalCourses,
            totalFaqs,
            totalTestSeries,
            totalNotes,
            totalDoubts
        ] = await Promise.all([
            User.countDocuments(),
            Order.countDocuments(),
            Course.countDocuments(),
            FAQ.countDocuments(),
            TestSeries.countDocuments(),
            Note.countDocuments(),
            Doubt.countDocuments()
        ]);

        res.status(200).json({
            success: true,
            counts: {
                users: totalUsers,
                orders: totalOrders,
                courses: totalCourses,
                faqs: totalFaqs,
                testSeries: totalTestSeries,
                notes: totalNotes,
                doubts: totalDoubts
            }
        });
    } catch (error) {
        console.error("❌ Error fetching counts:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching counts",
            error: error.message
        });
    }
};
