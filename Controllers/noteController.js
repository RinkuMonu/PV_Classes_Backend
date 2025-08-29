const Note = require("../Models/Note");
const fs = require("fs");
const path = require("path");

// Create Note
exports.createNote = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !description || !req.file) {
            return res.status(400).json({ message: "Title, description and PDF file are required" });
        }

        const existing = await Note.findOne({ title });
        if (existing) {
            return res.status(400).json({ message: "Note with this title already exists" });
        }

        const pdfUrl = `uploads/pdf/${req.file.filename}`;
        const note = new Note({
            title,
            description,
            pdfUrl
        });
        await note.save();

        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Get All Notes
exports.getNotes = async (req, res) => {
    try {
        const notes = await Note.find();
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Search Notes
exports.searchNotes = async (req, res) => {
    try {
        const { q } = req.query;
        const notes = await Note.find({
            title: { $regex: q, $options: "i" }
        });
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Get Single Note
exports.getNoteById = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Update Note
exports.updateNote = async (req, res) => {
    try {
        const { title, description } = req.body;
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        if (title) note.title = title;
        if (description) note.description = description;

        if (req.file) {
            if (note.pdfUrl) {
                const oldPath = path.join(__dirname, `../${note.pdfUrl}`);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
            note.pdfUrl = `uploads/pdf/${req.file.filename}`;
        }

        await note.save();
        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Delete Note
exports.deleteNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        if (note.pdfUrl) {
            const filePath = path.join(__dirname, `../${note.pdfUrl}`);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await note.deleteOne();
        res.status(200).json({ message: "Note deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
