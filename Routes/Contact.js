const express = require("express");
const router = express.Router();
const contactController = require("../Controllers/Contact");

// POST - Create contact
router.post("/", contactController.createContact);

// GET - Get all contacts
router.get("/", contactController.getContacts);

module.exports = router;
 