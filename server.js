const express = require('express');
const cors = require('cors');
const path = require('path');
const { router: authRoutes } = require('./routes/auth');
const packageRoutes = require('./routes/packages');
const bookingRoutes = require('./routes/bookings');
const adminRoutes = require('./routes/admin');
const blogRoutes = require('./routes/blogs');
const reviewRoutes = require('./routes/reviews');

require('dotenv').config();
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/reviews', reviewRoutes);

// Optional: Serve frontend static files if running together
app.use(express.static(path.join(__dirname, '../frontend')));

app.listen(PORT, () => {
  console.log(`Voyara Backend Server running on http://localhost:${PORT}`);
});
