require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Blog = require('../models/Blog');
const Review = require('../models/Review');
const Package = require('../models/Package');
const User = require('../models/User');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing blogs/reviews if any (be careful)
    // await Blog.deleteMany();
    // await Review.deleteMany();

    const admin = await User.findOne({ role: 'admin' });
    const user = await User.findOne({ role: 'user' });
    const pkg = await Package.findOne();

    if (!admin || !user || !pkg) {
      console.log('Error: Could not find required users or packages for seeding. Please run migration.js first.');
      process.exit(1);
    }

    const blogs = [
      {
        title: 'Hidden Waterfalls of Bali: A Local Guide',
        category: 'guides',
        destination: 'Bali, Indonesia',
        excerpt: 'Move over Tegenungan. We explore the 5 secret waterfalls you need to see.',
        content: 'Bali is famous for its beaches, but its heart belongs to the jungle...',
        authorTag: 'Verified Traveller',
        author: user.firstName + ' ' + user.lastName,
        authorInitials: (user.firstName[0] + user.lastName[0]).toUpperCase(),
        user: user._id,
        isVerified: false
      },
      {
        title: 'How I Planned my Dream Santorini Honeymoon for under 2 Lakhs',
        category: 'budget',
        destination: 'Santorini, Greece',
        excerpt: 'Yes, it is possible. Here is the exact breakdown of our flights, stay and food.',
        content: 'We always thought Greece was out of reach until we started digging...',
        author: 'Voyara Expert',
        authorInitials: 'VE',
        user: admin._id,
        isVerified: true
      }
    ];

    const reviews = [
      {
        package: pkg._id,
        user: user._id,
        userName: user.firstName + ' ' + user.lastName,
        rating: 5,
        text: 'Everything was perfectly organized. The hotel in ' + pkg.location + ' was stunning!'
      }
    ];

    await Blog.insertMany(blogs);
    await Review.insertMany(reviews);

    console.log('Successfully seeded 2 blogs and 1 review!');
    process.exit();
  } catch (err) {
    console.error('Seed Error:', err);
    process.exit(1);
  }
};

seedData();
