const express = require('express');
const Booking = require('../models/Booking');
const Package = require('../models/Package');
const { verifyToken } = require('./auth');
const router = express.Router();

// Get bookings for logged-in user
router.get('/my-trips', verifyToken, async (req, res) => {
  try {
    const userBookings = await Booking.find({ userId: req.user.id }).sort({ createdAt: -1 });
    
    // If the package details weren't embedded, fetch them now
    const results = await Promise.all(userBookings.map(async (b) => {
      const bookingObj = b.toObject();
      if (!bookingObj.package || !bookingObj.package.title) {
        const pkg = await Package.findOne({ id: b.packageId });
        bookingObj.package = pkg || { title: 'Unknown Package' };
      }
      return bookingObj;
    }));

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a booking
router.post('/', verifyToken, async (req, res) => {
  try {
    const { packageId, checkIn, checkOut, guests, amount, specialRequests } = req.body;
    
    if (!packageId || !checkIn || !amount) {
      return res.status(400).json({ error: 'Incomplete booking details' });
    }
    
    const pkg = await Package.findOne({ id: packageId });
    
    const bookingId = `VYR-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const invoiceId = `INV-${String(Math.random()).slice(2, 10)}`;

    const newBooking = new Booking({
      id: bookingId,
      invoiceId: invoiceId,
      userId: req.user.id,
      packageId,
      checkIn,
      checkOut,
      guests,
      amount,
      specialRequests,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
      package: pkg ? { title: pkg.title, location: pkg.location, image: pkg.image } : undefined
    });
    
    await newBooking.save();
    res.status(201).json({ message: 'Booking confirmed', booking: newBooking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cancel a booking
router.put('/:id/cancel', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findOne({ 
      $and: [
        { $or: [{ id: id }, { _id: mongoose.isValidObjectId(id) ? id : undefined }] },
        { userId: req.user.id }
      ]
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found or access denied' });
    }

    if (booking.status === 'Cancelled') {
      return res.status(400).json({ error: 'Booking is already cancelled' });
    }

    booking.status = 'Cancelled';
    await booking.save();
    
    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
