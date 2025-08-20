const Combo = require("../Models/Combo");

// ✅ Create Combo
exports.createCombo = async (req, res) => {
    try {
        const { title, slug, description, price, discountPercent, validity, books, testSeries, pyqs } = req.body;

        const newCombo = new Combo({
            title,
            slug,
            description,
            price,
            discountPercent,
            validity,
            books,
            testSeries,
            pyqs,
        });

        // discount_price will be calculated by pre-save hook
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
        const combo = await Combo.findById(req.params.id);
        if (!combo) return res.status(404).json({ success: false, message: "Combo not found" });

        // Update fields
        Object.assign(combo, req.body);

        // Recalculate discount_price if price or discountPercent changes
        if (req.body.price || req.body.discountPercent) {
            combo.discount_price = combo.price - (combo.price * (combo.discountPercent || 0)) / 100;
        }

        await combo.save();
        res.status(200).json({ success: true, combo });
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
