import type { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler.js';

/**
 * Augment the Express Request interface to include the authenticated user.
 */
declare module 'express' {
  interface Request {
    user?: { id: string; email: string };
  }
}

/**
 * Authentication middleware that verifies JWT from the Authorization header.
 * Attaches the decoded user payload to `req.user`.
 *
 * TODO: Implement JWT verification in the auth feature phase.
 */
export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    next(new AppError('No authentication token provided', 401, 'UNAUTHORIZED'));
    return;
  }

  const token = authHeader.slice(7);

  if (!token) {
    next(new AppError('No authentication token provided', 401, 'UNAUTHORIZED'));
    return;
  }

  // TODO: Verify token with jsonwebtoken and attach decoded user to req.user
  // For now, pass through to allow skeleton to compile
  next();
}
