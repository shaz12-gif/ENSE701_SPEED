/**
 * MongoDB connection helper
 * 
 * Establishes connection to MongoDB using mongoose
 * with proper error handling and logging
 */
const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * @returns {Promise<mongoose.Connection>} Mongoose connection object
 */
const connectDB = async () => {
  try {
    // Validate environment variables
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }
    
    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.DB_URI, {
      // Connection options are now defined in mongoose.connect() directly
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn.connection;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;