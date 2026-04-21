const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  id: { type: String, unique: true }, // 'maldives', 'rajasthan', etc.
  title: { type: String, required: true },
  type: { type: String, required: true }, // 'national', 'international'
  category: { type: String, required: true }, // 'honeymoon', 'family', etc.
  location: { type: String, required: true },
  duration: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  desc: { type: String },
  badges: [{ type: String }],
  rating: { type: Number, default: 5 },
  reviewCount: { type: Number, default: 0 },
  included: [{ type: String }],
  meta: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Package', packageSchema);
