// const PYQ = require("../Models/Pyqs");
// const fs = require("fs");
// const path = require("path");


// exports.createPYQ = async (req, res) => {
//     try {
//         const { exam, description, status, category, price, discount } = req.body;

//         if (!exam || !description || !req.file || !category) {
//             return res.status(400).json({ message: "Exam, description, category and PDF file are required" });
//         }

//         if (status && !["free", "paid"].includes(status)) {
//             return res.status(400).json({ message: "Status must be 'free' or 'paid'" });
//         }

//         const existing = await PYQ.findOne({ exam });
//         if (existing) {
//             return res.status(400).json({ message: "Exam already exists" });
//         }

//         const pdfUrl = `uploads/pdf/${req.file.filename}`;
//         const pyq = new PYQ({
//             exam,
//             description,
//             category,
//             pdfUrl,
//             status: status || "free",
//             price: price || 0,
//             discount: discount || 0
//         });
//         await pyq.save();

//         res.status(201).json(pyq);
//     } catch (error) {
//         res.status(500).json({ message: "Server Error", error: error.message });
//     }
// };


// // Get All PYQs
// exports.getPYQs = async (req, res) => {
//     try {
//         const pyqs = await PYQ.find();
//         res.status(200).json(pyqs);
//     } catch (error) {
//         res.status(500).json({ message: "Server Error", error: error.message });
//     }
// };

// // Search PYQs
// exports.searchPYQs = async (req, res) => {
//     try {
//         const { q } = req.query;
//         const pyqs = await PYQ.find({
//             exam: { $regex: q, $options: "i" }
//         });
//         res.status(200).json(pyqs);
//     } catch (error) {
//         res.status(500).json({ message: "Server Error", error: error.message });
//     }
// };

// // Get Single PYQ
// exports.getPYQById = async (req, res) => {
//     try {
//         const pyq = await PYQ.findById(req.params.id);
//         if (!pyq) {
//             return res.status(404).json({ message: "PYQ not found" });
//         }
//         res.status(200).json(pyq);
//     } catch (error) {
//         res.status(500).json({ message: "Server Error", error: error.message });
//     }
// };


// exports.updatePYQ = async (req, res) => {
//     try {
//         const { exam, description, status, category, price, discount } = req.body;
//         const pyq = await PYQ.findById(req.params.id);
//         if (!pyq) {
//             return res.status(404).json({ message: "PYQ not found" });
//         }

//         if (exam) pyq.exam = exam;
//         if (description) pyq.description = description;
//         if (category) pyq.category = category;
//         if (status) {
//             if (!["free", "paid"].includes(status)) {
//                 return res.status(400).json({ message: "Status must be 'free' or 'paid'" });
//             }
//             pyq.status = status;
//         }
//         if (price !== undefined) pyq.price = price;
//         if (discount !== undefined) pyq.discount = discount;

//         if (req.file) {
//             if (pyq.pdfUrl) {
//                 const oldPath = path.join(__dirname, `../${pyq.pdfUrl}`);
//                 if (fs.existsSync(oldPath)) {
//                     fs.unlinkSync(oldPath);
//                 }
//             }
//             pyq.pdfUrl = `uploads/pdf/${req.file.filename}`;
//         }

//         await pyq.save();
//         res.status(200).json(pyq);
//     } catch (error) {
//         res.status(500).json({ message: "Server Error", error: error.message });
//     }
// };


// // Delete PYQ
// exports.deletePYQ = async (req, res) => {
//     try {
//         const pyq = await PYQ.findById(req.params.id);
//         if (!pyq) {
//             return res.status(404).json({ message: "PYQ not found" });
//         }

//         if (pyq.pdfUrl) {
//             const filePath = path.join(__dirname, `../${pyq.pdfUrl}`);
//             if (fs.existsSync(filePath)) {
//                 fs.unlinkSync(filePath);
//             }
//         }

//         await pyq.deleteOne();
//         res.status(200).json({ message: "PYQ deleted successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Server Error", error: error.message });
//     }
// };




const PYQ = require("../Models/Pyqs");
const fs = require("fs");
const path = require("path");

// Create PYQ
exports.createPYQ = async (req, res) => {
    try {
        const { exam, description, category } = req.body;

        if (!exam || !description || !req.file || !category) {
            return res.status(400).json({ message: "Exam, description, category and PDF file are required" });
        }

        const existing = await PYQ.findOne({ exam });
        if (existing) {
            return res.status(400).json({ message: "Exam already exists" });
        }

        const pdfUrl = `uploads/pdf/${req.file.filename}`;
        const pyq = new PYQ({
            exam,
            description,
            category,
            pdfUrl
        });
        await pyq.save();

        res.status(201).json(pyq);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Get All PYQs
exports.getPYQs = async (req, res) => {
    try {
        const pyqs = await PYQ.find();
        res.status(200).json(pyqs);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Search PYQs
exports.searchPYQs = async (req, res) => {
    try {
        const { q } = req.query;
        const pyqs = await PYQ.find({
            exam: { $regex: q, $options: "i" }
        });
        res.status(200).json(pyqs);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Get Single PYQ
exports.getPYQById = async (req, res) => {
    try {
        const pyq = await PYQ.findById(req.params.id);
        if (!pyq) {
            return res.status(404).json({ message: "PYQ not found" });
        }
        res.status(200).json(pyq);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Update PYQ
exports.updatePYQ = async (req, res) => {
    try {
        const { exam, description, category } = req.body;
        const pyq = await PYQ.findById(req.params.id);
        if (!pyq) {
            return res.status(404).json({ message: "PYQ not found" });
        }

        if (exam) pyq.exam = exam;
        if (description) pyq.description = description;
        if (category) pyq.category = category;

        if (req.file) {
            if (pyq.pdfUrl) {
                const oldPath = path.join(__dirname, `../${pyq.pdfUrl}`);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
            pyq.pdfUrl = `uploads/pdf/${req.file.filename}`;
        }

        await pyq.save();
        res.status(200).json(pyq);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Delete PYQ
exports.deletePYQ = async (req, res) => {
    try {
        const pyq = await PYQ.findById(req.params.id);
        if (!pyq) {
            return res.status(404).json({ message: "PYQ not found" });
        }

        if (pyq.pdfUrl) {
            const filePath = path.join(__dirname, `../${pyq.pdfUrl}`);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await pyq.deleteOne();
        res.status(200).json({ message: "PYQ deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
