const express = require('express');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User'); // Import Mongoose User model
const router = express.Router();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const JWT_SECRET = process.env.JWT_SECRET || 'voyara_super_secret_key_2026';

router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;
    
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const id = 'u' + Date.now();
    const newUser = new User({
      id,
      firstName,
      lastName,
      email,
      phone,
      password, // In a real app, hash this with bcrypt!
      role: 'user',
      joined: new Date().toISOString()
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({ 
      message: 'User created successfully', 
      token, 
      user: { id: newUser.id, firstName: newUser.firstName, lastName: newUser.lastName, email: newUser.email, role: newUser.role } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email, password });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    const { sub, email, given_name, family_name } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user for first-time Google login
      user = new User({
        id: 'u' + Date.now(),
        firstName: given_name,
        lastName: family_name || 'User',
        email: email,
        googleId: sub,
        role: 'user',
        joined: new Date().toISOString()
      });
      await user.save();
    } else if (!user.googleId) {
      // Link Google ID to existing email account
      user.googleId = sub;
      await user.save();
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      message: 'Google login successful',
      token,
      user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(401).json({ error: 'Google authentication failed' });
  }
});

// Middleware to verify token
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ id: decoded.id });
    if (!user) return res.status(401).json({ error: 'User not found' });
    
    req.user = { 
      id: user.id, 
      role: user.role, 
      name: `${user.firstName} ${user.lastName}`.trim(),
      email: user.email
    };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ id: req.user.id });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Return without password
    const safeUser = user.toObject();
    delete safeUser.password;
    res.json({ user: safeUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;
    
    const user = await User.findOne({ id: req.user.id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update fields
    if (firstName) user.firstName = firstName;
    if (lastName)  user.lastName  = lastName;
    if (phone)     user.phone     = phone;

    await user.save();

    // Return updated user (without password)
    const safeUser = user.toObject();
    delete safeUser.password;
    res.json({ 
      message: 'Profile updated successfully', 
      user: safeUser 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = { router, verifyToken };
