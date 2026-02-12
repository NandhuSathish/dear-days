import jwt, { type SignOptions } from 'jsonwebtoken';
import type { IAuthResponse, IUserCreate, IUserLogin } from '@dear-days/shared';
import { env } from '../config/env.js';
import User, { type IUserDocument } from '../models/user.model.js';
import { AppError } from '../middlewares/errorHandler.js';

/**
 * JWT token payload shape.
 */
export interface ITokenPayload {
  id: string;
  email: string;
}

/**
 * Generate a short-lived access token.
 */
export function generateAccessToken(payload: ITokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as SignOptions);
}

/**
 * Generate a long-lived refresh token.
 */
export function generateRefreshToken(payload: ITokenPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  } as SignOptions);
}

/**
 * Verify and decode an access token.
 */
export function verifyAccessToken(token: string): ITokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as ITokenPayload;
}

/**
 * Verify and decode a refresh token.
 */
export function verifyRefreshToken(token: string): ITokenPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as ITokenPayload;
}

/**
 * Build the standard auth response from a user document.
 */
function buildAuthResponse(user: IUserDocument): IAuthResponse {
  const payload: ITokenPayload = { id: user._id.toString(), email: user.email };
  const json = user.toJSON();

  return {
    user: {
      email: json.email,
      displayName: json.displayName,
      avatarUrl: json.avatarUrl,
      createdAt: json.createdAt.toISOString(),
      updatedAt: json.updatedAt.toISOString(),
    },
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
}

/**
 * Register a new user and return tokens.
 */
export async function registerUser(data: IUserCreate): Promise<IAuthResponse> {
  const existing = await User.findOne({ email: data.email.toLowerCase() });
  if (existing) {
    throw new AppError('An account with this email already exists', 409, 'DUPLICATE_EMAIL');
  }

  const user = await User.create(data);
  return buildAuthResponse(user);
}

/**
 * Authenticate a user with email and password and return tokens.
 */
export async function loginUser(data: IUserLogin): Promise<IAuthResponse> {
  const user = await User.findOne({ email: data.email.toLowerCase() }).select('+password');
  if (!user) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  const isMatch = await user.comparePassword(data.password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  return buildAuthResponse(user);
}

/**
 * Issue a new token pair from a valid refresh token.
 */
export async function refreshTokens(token: string): Promise<IAuthResponse> {
  const decoded = verifyRefreshToken(token);

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  return buildAuthResponse(user);
}

/**
 * Retrieve a user by ID.
 */
export async function getUserById(id: string): Promise<IUserDocument> {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }
  return user;
}
