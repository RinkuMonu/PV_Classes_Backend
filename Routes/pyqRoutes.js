const express = require('express');
const router = express.Router();
const pyqController = require('../Controllers/pyqController');
const upload = require('../middleware/upload');

// Create PYQ (Upload PDF to uploads/pdf)
router.post('/', upload("pdf").single("pdf"), pyqController.createPYQ);

// Get all PYQs
router.get('/', pyqController.getPYQs);

// ✅ Search PYQs (should be before :id route to avoid conflict)
router.get('/search', pyqController.searchPYQs);

// Get single PYQ
router.get('/:id', pyqController.getPYQById);

// Update PYQ (optional: allow new PDF upload)
router.put('/:id', upload("pdf").single("pdf"), pyqController.updatePYQ);

// Delete PYQ
router.delete('/:id', pyqController.deletePYQ);

module.exports = router;