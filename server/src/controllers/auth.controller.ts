import type { Request, Response, NextFunction } from 'express';
import type { IApiResponse, IAuthResponse, IUserCreate, IUserLogin } from '@dear-days/shared';
import * as authService from '../services/auth.service.js';

/**
 * POST /api/v1/auth/register
 * Create a new user account and return tokens.
 */
export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data: IUserCreate = req.body;
    const result = await authService.registerUser(data);

    const response: IApiResponse<IAuthResponse> = {
      success: true,
      data: result,
    };

    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/auth/login
 * Authenticate user and return tokens.
 */
export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data: IUserLogin = req.body;
    const result = await authService.loginUser(data);

    const response: IApiResponse<IAuthResponse> = {
      success: true,
      data: result,
    };

    res.json(response);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/auth/refresh
 * Issue a new token pair from a valid refresh token.
 */
export async function refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { refreshToken: token } = req.body;
    const result = await authService.refreshTokens(token);

    const response: IApiResponse<IAuthResponse> = {
      success: true,
      data: result,
    };

    res.json(response);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/auth/me
 * Get the authenticated user's profile.
 */
export async function getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await authService.getUserById(req.user!.id);
    const json = user.toJSON();

    const response: IApiResponse<typeof json> = {
      success: true,
      data: json,
    };

    res.json(response);
  } catch (err) {
    next(err);
  }
}
