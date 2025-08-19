const Order = require("../Models/Order");


exports.checkout = async (req, res) => {
    try {
        const { courses = [], books = [], testSeries = [], address, paymentMethod, totalAmount } = req.body;
        const userId = req.user.id;

        if ((!courses.length && !books.length && !testSeries.length) || !address || !paymentMethod || !totalAmount) {
            return res.status(400).json({ message: "At least one item (course/book/testSeries) and all fields are required!" });
        }

        if ((courses?.length || books?.length || testSeries?.length) > 0) {

            const courseIds = courses?.map(c => c.course) || [];
            const bookIds = books?.map(b => b.book) || [];
            const testSeriesIds = testSeries?.map(t => t.test) || [];

            console.log(courseIds, bookIds, testSeriesIds)

            const existingOrder = await Order.findOne({
                user: userId,
                orderStatus: "completed",
                $or: [
                    { "courses.course": { $in: courseIds } },
                    { "books.book": { $in: bookIds } },
                    { "testSeries.test": { $in: testSeriesIds } }
                ]
            });

            if (existingOrder) {
                return res.status(400).json({
                    message: "You already purchased one of these items!",
                    alreadyPurchased: {
                        courses: existingOrder.courses.map(c => c.course),
                        books: existingOrder.books.map(b => b.book),
                        testSeries: existingOrder.testSeries.map(t => t.testSeries)
                    }
                });
            }
        }



        const order = new Order({
            user: userId,
            courses,
            books,
            testSeries,
            address,
            totalAmount,
            paymentMethod
        });

        await order.save();

        res.status(201).json({
            message: "Checkout successful, order created!",
            order,
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
