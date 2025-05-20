import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/speed';
const MONGODB_DB = process.env.MONGODB_DB || 'speed';

// Connection cache
let cachedClient = null;
let cachedDb = null;

/**
 * Connects to MongoDB and returns the client and database
 * @returns {Promise<{client: MongoClient, db: Db}>} MongoDB client and database
 */
export async function connectToDatabase() {
  // If we have cached connections, return them
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // Connect to MongoDB
  const client = await MongoClient.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(MONGODB_DB);

  // Cache the connections
  cachedClient = client;
  cachedDb = db;

  return { client, db };
}