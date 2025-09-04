const express = require("express");
const { createFAQ, getAllFAQs, updateFAQ, deleteFAQ, getFAQById } = require("../Controllers/faqController");
// const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Create FAQ
router.post("/", createFAQ);

router.get("/:id", getFAQById);

router.get("/", getAllFAQs);

// Update FAQ
router.put("/:id", updateFAQ);

// Delete FAQ  
router.delete("/:id", deleteFAQ);

module.exports = router;
