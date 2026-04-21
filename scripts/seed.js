const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Package = require('../models/Package');
const Destination = require('../models/Destination');

dotenv.config({ path: './.env' });

const packages = [
  { id: 'maldives',  title: 'Maldives Bliss Package',        category: 'honeymoon', type: 'international', location: 'Maldives',      duration: '5 Days / 4 Nights', price: 85999,  image: 'https://images.unsplash.com/photo-1559628233-100c798642d4?w=600&q=80',     desc: 'Overwater villa, candlelit dinners, snorkelling, and sunset cruises for two.', badges: ['Bestseller'], rating: 4.9, reviewCount: 128, meta: ['✈️ Flights Included', '🍽️ Meals Included'], included: ['Luxury overwater villa', 'Daily candlelight dinner', 'Snorkelling gear', 'Sunset cruise'] },
  { id: 'rajasthan', title: 'Royal Rajasthan Family Tour',    category: 'family',    type: 'national',      location: 'Rajasthan',     duration: '8 Days / 7 Nights', price: 32499,  image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80',  desc: 'Forts, palaces, camel rides, and folk cultural evenings for the whole family.', badges: [], rating: 4.7, reviewCount: 94, meta: ['🚌 Transport Included', '🏨 4-Star Hotels'], included: ['Palace stay in Jaipur', 'Camel safari in Thar', 'Guided city tours', 'Cultural folk evening'] },
  { id: 'manali',    title: 'Himalayan Adventure Rush',       category: 'adventure', type: 'national',      location: 'Manali',        duration: '6 Days / 5 Nights', price: 18999,  image: 'https://images.unsplash.com/photo-1594002413550-ba57ce8fc161?w=600&q=80',                                                             desc: 'Paragliding, river rafting, trekking, and snow sports in the mighty Himalayas.', badges: ['New'], rating: 4.5, reviewCount: 67, meta: ['🧗 All Activities', '🍳 Breakfast Incl.'], included: ['Paragliding session', 'Solang Valley trip', 'River rafting', 'Professional guide'] },
  { id: 'swiss',     title: 'Swiss Alps Grand Tour',          category: 'luxury',    type: 'international', location: 'Switzerland',   duration: '7 Days / 6 Nights', price: 124999, image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80', desc: 'Five-star chalets, private skiing lessons, scenic rail journeys, and fine dining.', badges: [], rating: 4.9, reviewCount: 43, meta: ['✈️ Flights Included', '⭐ 5-Star Hotels'], included: ['Luxury chalet stay', 'Private ski lessons', 'Glacier Express tickets', 'Fine dining experience'] },
  { id: 'bali',      title: 'Bali Budget Explorer',           category: 'budget',    type: 'international', location: 'Bali',          duration: '5 Days / 4 Nights', price: 38499,  image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',  desc: 'Temples, rice terraces, surf lessons, and a cooking class without breaking the bank.', badges: ['Value Pick'], rating: 4.4, reviewCount: 211, meta: ['🏨 3-Star Stays', '🛵 Scooter Rental'], included: ['Boutique villa stay', 'Balinese cooking class', 'Temple & rice terrace tour', 'Surf lesson'] },
  { id: 'london',    title: 'London Family Experience',       category: 'family',    type: 'international', location: 'London',        duration: '7 Days / 6 Nights', price: 92999,  image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80', desc: 'Harry Potter tour, Buckingham Palace, museums, and a West End show.', badges: [], rating: 4.8, reviewCount: 76, meta: ['✈️ Flights Included', '🎭 Show Tickets'], included: ['WB Harry Potter Studio tour', 'Buckingham Palace visit', 'West End show tickets', 'Hop-on hop-off pass'] }
];

const destinations = [
  { id: 'd1', title: 'Maldives', country: 'Maldives', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&q=80' },
  { id: 'd2', title: 'Bali', country: 'Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80' },
  { id: 'd3', title: 'Santorini', country: 'Greece', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80' },
  { id: 'd4', title: 'Tokyo', country: 'Japan', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=80' }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    await Package.deleteMany({});
    await Package.insertMany(packages);
    console.log('Packages seeded!');

    await Destination.deleteMany({});
    await Destination.insertMany(destinations);
    console.log('Destinations seeded!');

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
