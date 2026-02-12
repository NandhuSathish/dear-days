import type { IAuthResponse, IUserCreate, IUserLogin, IUser } from '@dear-days/shared';
import { apiClient } from './api';

/**
 * Save JWT tokens to localStorage.
 */
export function saveTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
}

/**
 * Clear JWT tokens from localStorage.
 */
export function clearTokens(): void {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

/**
 * Check if an access token exists in localStorage.
 */
export function hasToken(): boolean {
  return !!localStorage.getItem('accessToken');
}

/**
 * Register a new user account.
 */
export async function register(data: IUserCreate): Promise<IAuthResponse> {
  const res = await apiClient.post<IAuthResponse>('/auth/register', data);
  const auth = res.data!;
  saveTokens(auth.accessToken, auth.refreshToken);
  return auth;
}

/**
 * Log in with email and password.
 */
export async function login(data: IUserLogin): Promise<IAuthResponse> {
  const res = await apiClient.post<IAuthResponse>('/auth/login', data);
  const auth = res.data!;
  saveTokens(auth.accessToken, auth.refreshToken);
  return auth;
}

/**
 * Fetch the currently authenticated user's profile.
 */
export async function getMe(): Promise<IUser> {
  const res = await apiClient.get<IUser>('/auth/me');
  return res.data!;
}

/**
 * Refresh the access token using the stored refresh token.
 */
export async function refreshToken(): Promise<IAuthResponse> {
  const token = localStorage.getItem('refreshToken');
  const res = await apiClient.post<IAuthResponse>('/auth/refresh', { refreshToken: token });
  const auth = res.data!;
  saveTokens(auth.accessToken, auth.refreshToken);
  return auth;
}
