const express = require('express');
const Destination = require('../models/Destination');
const router = express.Router();

// Get all destinations publicly
router.get('/', async (req, res) => {
  try {
    const destinations = await Destination.find({});
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single destination by ID
router.get('/:id', async (req, res) => {
  try {
    const destId = req.params.id;
    // Handle both custom String IDs and MongoDB ObjectIds flexibly
    const query = [
      { id: destId }
    ];
    if (destId.length === 24) {
      query.push({ _id: destId });
    }
    const destination = await Destination.findOne({ $or: query });
    
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    
    res.json(destination);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
