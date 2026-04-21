const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, unique: true }, // For compatibility with existing IDs like 'u1'
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String }, // Optional for Google SSO users
  googleId: { type: String }, // Store Google unique identifier
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  joined: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
