import type { IUser } from './user.js';

/**
 * Structured API error detail.
 */
export interface IApiError {
  field?: string;
  message: string;
  code?: string;
}

/**
 * Standard API response envelope wrapping all endpoints.
 */
export interface IApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: IApiError[];
}

/**
 * Paginated API response for list endpoints.
 */
export interface IPaginatedResponse<T = unknown> extends IApiResponse<T[]> {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Response payload for authentication endpoints.
 */
export interface IAuthResponse {
  user: Omit<IUser, 'id'>;
  accessToken: string;
  refreshToken: string;
}
