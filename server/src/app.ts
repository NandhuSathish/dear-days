import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import type { IApiResponse } from '@dear-days/shared';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import apiRouter from './routes/index.js';

/**
 * Creates and configures the Express application with all middleware.
 */
const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(env.UPLOAD_DIR));

// Health check
app.get('/api/health', (_req, res) => {
  const response: IApiResponse<{ status: string; timestamp: number }> = {
    success: true,
    data: { status: 'ok', timestamp: Date.now() },
  };
  res.json(response);
});

// API routes (versioned)
app.use('/api/v1', apiRouter);

// 404 handler for unmatched routes
app.use((_req, res) => {
  const response: IApiResponse = {
    success: false,
    message: 'Route not found',
  };
  res.status(404).json(response);
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;
