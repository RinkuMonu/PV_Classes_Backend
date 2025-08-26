const express = require("express");
const { createContact, getContacts, getContactById } = require("../Controllers/Contact");

const router = express.Router();

// Public - anyone can submit
router.post("/", createContact);

// Admin - fetch all messages
router.get("/", getContacts);

// Admin - fetch single message
router.get("/contact/:id", getContactById);

module.exports = router;
