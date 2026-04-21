const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  id: { type: String, unique: true }, // 'd1', 'd2', etc.
  title: { type: String, required: true },
  country: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String },
  duration: { type: String },
  budget: { type: String },
  season: { type: String },
  visa: { type: String },
  checklist: [{ type: String }],
  type: { type: String }, // 'national', 'international'
  category: { type: String } // 'beach', 'mountain', etc.
}, { timestamps: true });

module.exports = mongoose.model('Destination', destinationSchema);
