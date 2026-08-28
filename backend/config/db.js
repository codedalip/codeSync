const mongoose = require('mongoose');
const dns = require('dns');

const connectDB = async () => {
  // Fix for Windows DNS resolution bug (querySrv ECONNREFUSED) with MongoDB Atlas SRV records
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (dnsErr) {
    // Ignore DNS set failure if prohibited by OS policy
  }

  try {
    let mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/codesync';
    
    // Ensure database name 'codesync' is attached to URI if ending in trailing slash
    if (mongoUri.endsWith('.mongodb.net/') || mongoUri.endsWith('.mongodb.net')) {
      mongoUri = mongoUri.replace(/\/$/, '') + '/codesync?retryWrites=true&w=majority';
    }

    console.log(`[Database] Connecting to MongoDB Atlas...`);
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 8000
    });
    console.log(`[Database] ✅ MongoDB Atlas Connected Successfully!`);
  } catch (error) {
    console.log(`[Database Info] MongoDB connection error (${error.message}). Operating with built-in instant in-memory storage fallback.`);
  }
};

module.exports = connectDB;
