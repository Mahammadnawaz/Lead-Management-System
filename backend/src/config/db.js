import mongoose from 'mongoose';
import { seedDatabase } from '../seed/seed.js';

let mongod = null;

/**
 * Establishes connection to the MongoDB instance.
 * Automatically falls back to an in-memory MongoDB instance if local MongoDB is unavailable.
 */
export const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI;

  try {
    if (primaryUri) {
      console.log(`[MongoDB] Attempting to connect to: ${primaryUri}`);
      const conn = await mongoose.connect(primaryUri, {
        serverSelectionTimeoutMS: 2500,
        autoIndex: true,
      });
      console.log(`[MongoDB] Connected Successfully: ${conn.connection.host}`);
      return;
    }
  } catch (error) {
    console.warn(`[MongoDB Warning] Local MongoDB at ${primaryUri} not reachable: ${error.message}`);
  }

  // Graceful fallback to mongodb-memory-server
  try {
    console.log('[MongoDB] Starting zero-dependency in-memory MongoDB instance...');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongod = await MongoMemoryServer.create();
    const memoryUri = mongod.getUri();

    const conn = await mongoose.connect(memoryUri, {
      autoIndex: true,
    });
    console.log(`[MongoDB Memory Server] Connected Successfully at: ${memoryUri}`);

    // Auto-seed in-memory database with demo users & leads
    await seedDatabase();
  } catch (err) {
    console.error(`[MongoDB Fatal Error] Could not establish any database connection: ${err.message}`);
    process.exit(1);
  }
};
