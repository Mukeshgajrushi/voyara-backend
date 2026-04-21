require('dotenv').config();
const mongoose = require('mongoose');

const testDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    console.log('Attempting to connect to:', uri.split('@')[1]); // Show only cluster part for security
    
    await mongoose.connect(uri);
    console.log('✅ Success! Connected to MongoDB Atlas.');
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections found in database:', collections.map(c => c.name).join(', ') || 'None (Database is empty)');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Database Connection Error:', err.message);
    process.exit(1);
  }
};

testDB();
