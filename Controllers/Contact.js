const Contact = require("../Models/Contact");

exports.createContact = async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();
        res.status(201).json({ message: "Contact saved successfully", contact });
    } catch (error) {
        res.status(400).json({ message: "Error saving contact", error: error.message });
    }
};

exports.getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching contacts", error: error.message });
    }
};
