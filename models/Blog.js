const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['guides', 'tips', 'food', 'budget', 'honeymoon', 'adventure', 'community']
  },
  image: { type: String },
  destination: { type: String },
  excerpt: { type: String },
  content: { type: String, required: true },
  author: { type: String, required: true },
  authorInitials: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isVerified: { type: Boolean, default: false }, // Official vs Community
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Blog', blogSchema);
