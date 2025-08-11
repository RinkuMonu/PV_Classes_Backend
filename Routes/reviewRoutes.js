const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect, admin } = require('../middlewares/authMiddleware');

// User adds review
router.post('/', protect, reviewController.addReview);

// Admin approves review
router.put('/approve/:id', protect, admin, reviewController.approveReview);

// Public - get only approved reviews
router.get('/', reviewController.getApprovedReviews);

module.exports = router;
