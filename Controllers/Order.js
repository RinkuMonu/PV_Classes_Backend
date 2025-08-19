const Order = require("../Models/Order");
const Access = require("../Models/Access");
const Course = require("../Models/Course");
exports.checkout = async (req, res) => {
    try {
        const { courses = [], books = [], testSeries = [], address, paymentMethod, totalAmount } = req.body;
        const userId = req.user.id;

        if ((!courses.length && !books.length && !testSeries.length) || !address || !paymentMethod || !totalAmount) {
            return res.status(400).json({ message: "At least one item (course/book/testSeries) and all fields are required!" });
        }

        // Create order with initial pending/processing status
        const order = new Order({
            user: userId,
            courses,
            books,
            testSeries,
            address,
            totalAmount,
            paymentMethod,
            paymentStatus: "pending",
            orderStatus: "processing"
        });
        await order.save();

        // ✅ Grant Access for courses + combo items
        for (const c of courses) {
            const course = await Course.findById(c.course).populate("comboId");
            if (!course) continue;

            const validTill = course.validity
                ? new Date(Date.now() + parseInt(course.validity) * 24 * 60 * 60 * 1000)
                : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // default 1 year

            // Course access
            const existingAccessCourse = await Access.findOne({ user: userId, course: course._id });
            if (!existingAccessCourse) {
                await Access.create({ user: userId, course: course._id, validTill });
            }

            // Combo items access
            if (course.comboId) {
                const combo = course.comboId;
                
                if (combo.books?.length > 0) {
                    for (const bookId of combo.books) {
                        const existingBookAccess = await Access.findOne({ user: userId, book: bookId });
                        if (!existingBookAccess) {
                            await Access.create({ user: userId, book: bookId, validTill });
                        }
                    }
                }

                if (combo.testSeries?.length > 0) {
                    for (const testId of combo.testSeries) {
                        const existingTestAccess = await Access.findOne({ user: userId, testSeries: testId });
                        if (!existingTestAccess) {
                            await Access.create({ user: userId, testSeries: testId, validTill });
                        }
                    }
                }
            }
        }

        // ✅ Grant Access for standalone books
        for (const b of books) {
            const validTill = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
            const existingBookAccess = await Access.findOne({ user: userId, book: b.book });
            if (!existingBookAccess) {
                await Access.create({ user: userId, book: b.book, validTill });
            }
        }

        // ✅ Grant Access for standalone testSeries
        for (const t of testSeries) {
            const validTill = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
            const existingTestAccess = await Access.findOne({ user: userId, testSeries: t.test });
            if (!existingTestAccess) {
                await Access.create({ user: userId, testSeries: t.test, validTill });
            }
        }

        res.status(201).json({
            message: "Checkout successful, order created, access granted!",
            order
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const { userId, status } = req.query;

        const filter = {};
        if (userId) filter.user = userId;
        if (status) filter.orderStatus = status;

        const orders = await Order.find(filter)
            .populate("user", "name email")
            .populate("courses.course", "title price thumbnail")
            .populate("books.book", "title price thumbnail")
            .populate("testSeries.test", "title price thumbnail");

        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId)
            .populate("user", "name email")
            .populate("courses.course", "title price thumbnail")
            .populate("books.book", "title price thumbnail")
            .populate("testSeries.test", "title price thumbnail");

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

exports.changeOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if (!["pending", "completed", "cancelled"].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }

        const order = await Order.findByIdAndUpdate(
            orderId,
            { orderStatus: status },
            { new: true }
        )
            .populate("user", "name email")
            .populate("courses.course", "title price thumbnail")
            .populate("books.book", "title price thumbnail")
            .populate("testSeries.test", "title price thumbnail");

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.status(200).json({ success: true, message: "Order status updated", order });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
