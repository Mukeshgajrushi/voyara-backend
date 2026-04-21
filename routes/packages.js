const express = require('express');
const Package = require('../models/Package');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const packages = await Package.find({});
    res.json(packages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    // Search by the custom id (e.g. 'maldives') or _id
    const pkg = await Package.findOne({ id: req.params.id });
    if (!pkg) return res.status(404).json({ error: 'Package not found' });
    res.json(pkg);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
