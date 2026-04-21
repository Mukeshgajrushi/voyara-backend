const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  id: { type: String, unique: true }, // 'VYR-2025-08411', etc.
  userId: { type: String, required: true }, // Keep as string for migration compatibility
  packageId: { type: String, required: true },
  checkIn: { type: String, required: true },
  checkOut: { type: String, required: true },
  guests: {
    adults: { type: Number, default: 1 },
    children: { type: Number, default: 0 },
    infants: { type: Number, default: 0 }
  },
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], 
    default: 'Confirmed' 
  },
  specialRequests: { type: String },
  createdAt: { type: Date, default: Date.now },
  // Embedded package details for historical accuracy (as requested in original architecture)
  package: {
    title: String,
    location: String,
    image: String
  },
  invoiceId: { type: String, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
