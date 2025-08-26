const Contact = require("../Models/Contact");

// 📌 Create a new contact message
exports.createContact = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, message } = req.body;

        if (!firstName || !lastName || !email || !phone || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newContact = new Contact({
            firstName,
            lastName,
            email,
            phone,
            message
        });

        await newContact.save();

        res.status(201).json({
            message: "Message received successfully",
            contact: newContact
        });
    } catch (err) {
        console.error("Error saving contact:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// 📌 Fetch all contact messages (for admin panel)
exports.getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json(contacts);
    } catch (err) {
        console.error("Error fetching contacts:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// 📌 Fetch a single contact message by ID
exports.getContactById = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await Contact.findById(id);
        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }
        res.status(200).json(contact);
    } catch (err) {
        console.error("Error fetching contact:", err);
        res.status(500).json({ message: "Server error" });
    }
};
