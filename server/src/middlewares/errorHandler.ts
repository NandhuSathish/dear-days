import type { Request, Response, NextFunction } from 'express';
import type { IApiResponse } from '@dear-days/shared';
import { env } from '../config/env.js';
import logger from '../utils/logger.js';

/**
 * Custom application error with HTTP status code.
 * Use this to throw operational errors with proper status codes.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Global Express error-handling middleware.
 * Converts all errors into a standardized IApiResponse format.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (env.NODE_ENV === 'development') {
    logger.error(err.message, { stack: err.stack });
  } else {
    logger.error(err.message);
  }

  // Custom application error
  if (err instanceof AppError) {
    const response: IApiResponse = {
      success: false,
      message: err.message,
      errors: [{ message: err.message, code: err.code }],
    };
    res.status(err.statusCode).json(response);
    return;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const response: IApiResponse = {
      success: false,
      message: 'Validation failed',
      errors: [{ message: err.message, code: 'VALIDATION_ERROR' }],
    };
    res.status(400).json(response);
    return;
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    const response: IApiResponse = {
      success: false,
      message: 'Invalid resource ID',
      errors: [{ message: 'Malformed ID parameter', code: 'CAST_ERROR' }],
    };
    res.status(400).json(response);
    return;
  }

  // MongoDB duplicate key error
  if ('code' in err && (err as Record<string, unknown>).code === 11000) {
    const response: IApiResponse = {
      success: false,
      message: 'Duplicate field value',
      errors: [{ message: 'A resource with that value already exists', code: 'DUPLICATE_KEY' }],
    };
    res.status(409).json(response);
    return;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const response: IApiResponse = {
      success: false,
      message: 'Invalid token',
      errors: [{ message: 'Authentication token is invalid', code: 'INVALID_TOKEN' }],
    };
    res.status(401).json(response);
    return;
  }

  if (err.name === 'TokenExpiredError') {
    const response: IApiResponse = {
      success: false,
      message: 'Token expired',
      errors: [{ message: 'Authentication token has expired', code: 'TOKEN_EXPIRED' }],
    };
    res.status(401).json(response);
    return;
  }

  // Fallback: generic 500 error
  const response: IApiResponse = {
    success: false,
    message: env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  };
  res.status(500).json(response);
}
