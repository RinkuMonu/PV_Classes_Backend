const FAQ = require("../Models/FAQ");

// Create FAQ
exports.createFAQ = async (req, res) => {
    try {
        const { question, answer, category } = req.body;
        const faq = new FAQ({ question, answer, category });
        await faq.save();
        res.status(201).json({ success: true, message: "FAQ created successfully", faq });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get all FAQs
exports.getAllFAQs = async (req, res) => {
    try {
        const faqs = await FAQ.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, faqs });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Update FAQ
exports.updateFAQ = async (req, res) => {
    try {
        const { id } = req.params;
        const faq = await FAQ.findByIdAndUpdate(id, req.body, { new: true });

        if (!faq) {
            return res.status(404).json({ success: false, message: "FAQ not found" });
        }

        res.status(200).json({ success: true, message: "FAQ updated successfully", faq });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Delete FAQ
exports.deleteFAQ = async (req, res) => {
    try {
        const { id } = req.params;
        const faq = await FAQ.findByIdAndDelete(id);

        if (!faq) {
            return res.status(404).json({ success: false, message: "FAQ not found" });
        }

        res.status(200).json({ success: true, message: "FAQ deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
