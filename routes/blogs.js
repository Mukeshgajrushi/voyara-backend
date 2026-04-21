const express = require('express');
const Blog = require('../models/Blog');
const { verifyToken } = require('./auth');
const router = express.Router();

// Get blogs for the logged-in user
router.get('/my-blogs', verifyToken, async (req, res) => {
  try {
    const blogs = await Blog.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single blog by ID
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new blog (Protected)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, category, destination, excerpt, content, image } = req.body;
    
    // Get initials for avatar
    const initials = req.user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

    const newBlog = new Blog({
      title,
      category,
      destination,
      excerpt,
      content,
      image,
      author: req.user.name,
      authorInitials: initials,
      user: req.user.id,
      isVerified: false // Flag for mod review if needed
    });

    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
