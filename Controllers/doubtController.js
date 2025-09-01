const Doubt = require("../Models/Doubt");

// 📌 User creates a new doubt
exports.createDoubt = async (req, res) => {
    try {
        const userId = req.user.id; // authMiddleware se aayega
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: "Title and description are required" });
        }

        const doubt = await Doubt.create({
            user: userId,
            title,
            description
        });

        res.status(201).json({ message: "Doubt created successfully", doubt });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// 📌 Admin provides solution to a doubt
exports.solveDoubt = async (req, res) => {
    try {
        const { doubtId } = req.params;
        const { solution } = req.body;

        if (!solution) {
            return res.status(400).json({ message: "Solution is required" });
        }

        const doubt = await Doubt.findById(doubtId);
        if (!doubt) {
            return res.status(404).json({ message: "Doubt not found" });
        }

        doubt.solution = solution;
        doubt.status = "resolved";
        await doubt.save();

        res.status(200).json({ message: "Doubt resolved successfully", doubt });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// 📌 Get all doubts of a user (for user dashboard)
exports.getUserDoubts = async (req, res) => {
    try {
        const userId = req.user.id;
        const doubts = await Doubt.find({ user: userId }).sort({ createdAt: -1 });

        res.status(200).json({ doubts });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// 📌 Get all doubts (for admin panel)
exports.getAllDoubts = async (req, res) => {
    try {
        const doubts = await Doubt.find().populate("user", "name email").sort({ createdAt: -1 });

        res.status(200).json({ doubts });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
