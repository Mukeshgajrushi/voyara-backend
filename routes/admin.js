const express = require('express');
const User = require('../models/User');
const Package = require('../models/Package');
const Booking = require('../models/Booking');
const Destination = require('../models/Destination');
const Blog = require('../models/Blog');
const Review = require('../models/Review');
const { verifyToken } = require('./auth');
const router = express.Router();

// Middleware to verify admin role
const verifyAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
  next();
};

// ── DASHBOARD STATS ────────────────────────────────────────────────────────
router.get('/dashboard', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activePackages = await Package.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalDestinations = await Destination.countDocuments();
    
    const revenueData = await Booking.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;
    
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        revenue: totalRevenue,
        totalBookings,
        totalUsers,
        activePackages,
        totalDestinations
      },
      recentBookings
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── BOOKING MANAGEMENT ──────────────────────────────────────────────────────
router.get('/bookings', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── USER MANAGEMENT ─────────────────────────────────────────────────────────
router.get('/users', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/users', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/users/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PACKAGE MANAGEMENT ──────────────────────────────────────────────────────
router.post('/packages', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const newPkg = new Package({
      id: 'p' + Date.now(),
      ...req.body,
      rating: 5,
      reviewCount: 0
    });
    await newPkg.save();
    res.status(201).json(newPkg);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/packages/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    // Search by custom 'id' or MongoDB '_id'
    const result = await Package.findOneAndDelete({ id: req.params.id });
    if (!result) {
       await Package.findByIdAndDelete(req.params.id);
    }
    res.json({ message: 'Package deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DESTINATION MANAGEMENT ──────────────────────────────────────────────────
router.get('/destinations', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const dests = await Destination.find({});
    res.json(dests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/destinations', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const newDest = new Destination({
      id: 'd' + Date.now(),
      ...req.body
    });
    await newDest.save();
    res.status(201).json(newDest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/destinations/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const result = await Destination.findOneAndDelete({ id: req.params.id });
    if (!result) {
      await Destination.findByIdAndDelete(req.params.id);
    }
    res.json({ message: 'Destination deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── USER-GENERATED CONTENT (BLOGS/REVIEWS) ──────────────────────────────────
router.get('/interactions', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json({ blogs, reviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/blogs/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog post deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/reviews/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
