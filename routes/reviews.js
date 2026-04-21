const express = require('express');
const Review = require('../models/Review');
const Package = require('../models/Package');
const { verifyToken } = require('./auth');
const router = express.Router();

// Get reviews for the logged-in user
router.get('/my-reviews', verifyToken, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get reviews for a specific package
router.get('/package/:packageId', async (req, res) => {
  try {
    const reviews = await Review.find({ package: req.params.packageId })
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new review (Protected)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { packageId, rating, text } = req.body;

    const newReview = new Review({
      package: packageId,
      user: req.user.id,
      userName: req.user.name,
      rating,
      text
    });

    const savedReview = await newReview.save();

    // Optionally update package rating and review count logic could go here
    // But for now we just save the individual review
    
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
