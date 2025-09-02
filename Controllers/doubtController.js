const mongoose = require("mongoose");
const Doubt = require("../Models/Doubt");

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

exports.getDoubtById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const doubt = await Doubt.findById(id);
    if (!doubt) {
      return res.status(404).json({ message: "Doubt not found" });
    }

    res.json(doubt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllDoubts = async (req, res) => {
  try {
    const doubts = await Doubt.find()
      .populate("user", "name") // only fetch user name
      .select("title status");  // only fetch title & status from doubt

    // map response
    const formatted = doubts.map(d => ({
      id: d._id,
      userName: d.user?.name || "Unknown",
      title: d.title,
      status: d.status,
    }));

    res.status(200).json({ doubts: formatted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getDoubtHistory = async (req, res) => {
    try {
        const userId = req.user.id; // token se aayega

        const doubts = await Doubt.find({ user: userId })
            .select("title description solution status createdAt updatedAt")
            .sort({ createdAt: -1 });

        if (!doubts || doubts.length === 0) {
            return res.status(404).json({ message: "No doubt history found" });
        }

        res.status(200).json({
            message: "Doubt history fetched successfully",
            history: doubts
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};