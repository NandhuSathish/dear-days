import mongoose from 'mongoose';
import { env } from './env.js';
import logger from '../utils/logger.js';

/**
 * Establishes a connection to MongoDB using the configured URI.
 * Logs connection status and attaches an error handler for runtime errors.
 */
export async function connectDatabase(): Promise<void> {
  mongoose.set('strictQuery', true);

  mongoose.connection.on('error', (error) => {
    logger.error('MongoDB runtime error', { error });
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });

  await mongoose.connect(env.MONGODB_URI);
  logger.info('MongoDB connected successfully');
}

/**
 * Gracefully closes the MongoDB connection.
 */
export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected gracefully');
}
