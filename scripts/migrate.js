const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load models
const User = require('../models/User');
const Package = require('../models/Package');
const Booking = require('../models/Booking');

dotenv.config();

const migrateData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB for migration...');

    // 1. Migrate Users
    const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf-8'));
    await User.deleteMany({}); // Clear existing users
    await User.insertMany(usersData);
    console.log(`Migrated ${usersData.length} users.`);

    // 2. Migrate Packages
    const packagesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/packages.json'), 'utf-8'));
    await Package.deleteMany({}); // Clear existing packages
    await Package.insertMany(packagesData);
    console.log(`Migrated ${packagesData.length} packages.`);

    // 3. Migrate Bookings
    const bookingsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/bookings.json'), 'utf-8'));
    await Booking.deleteMany({}); // Clear existing bookings
    await Booking.insertMany(bookingsData);
    console.log(`Migrated ${bookingsData.length} bookings.`);

    console.log('Migration completed successfully!');
    process.exit();
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
};

migrateData();
