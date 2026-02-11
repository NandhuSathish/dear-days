import mongoose from 'mongoose';
import { env } from './env.js';

/**
 * Establishes a connection to MongoDB using the configured URI.
 * Logs connection status and attaches an error handler for runtime errors.
 */
export async function connectDatabase(): Promise<void> {
  mongoose.set('strictQuery', true);

  mongoose.connection.on('error', (error) => {
    console.error('MongoDB runtime error:', error);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
  });

  await mongoose.connect(env.MONGODB_URI);
  console.log('MongoDB connected successfully');
}

/**
 * Gracefully closes the MongoDB connection.
 */
export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  console.log('MongoDB disconnected gracefully');
}
