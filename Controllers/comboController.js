const Combo = require("../Models/Combo");

// ✅ Create Combo
exports.createCombo = async (req, res) => {
    try {
        const { title, slug, description, price, discount_price, validity, books, testSeries, pyqs } = req.body;

        const newCombo = new Combo({
            title,
            slug,
            description,
            price,
            discount_price,
            validity,
            books,
            testSeries,
            pyqs,
        });

        await newCombo.save();
        res.status(201).json({ success: true, combo: newCombo });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Get All Combos
exports.getCombos = async (req, res) => {
    try {
        const combos = await Combo.find()
            .populate("books")
            .populate("testSeries")
            .populate("pyqs");
        res.status(200).json({ success: true, combos });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Get Combo by ID
exports.getComboById = async (req, res) => {
    try {
        const combo = await Combo.findById(req.params.id)
            .populate("books")
            .populate("testSeries")
            .populate("pyqs");

        if (!combo) return res.status(404).json({ success: false, message: "Combo not found" });

        res.status(200).json({ success: true, combo });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Update Combo
exports.updateCombo = async (req, res) => {
    try {
        const updatedCombo = await Combo.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true }
        );

        if (!updatedCombo) return res.status(404).json({ success: false, message: "Combo not found" });

        res.status(200).json({ success: true, combo: updatedCombo });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Delete Combo
exports.deleteCombo = async (req, res) => {
    try {
        const deleted = await Combo.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ success: false, message: "Combo not found" });

        res.status(200).json({ success: true, message: "Combo deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
