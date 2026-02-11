/**
 * Core user entity returned from the API.
 */
export interface IUser {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Payload for user registration.
 */
export interface IUserCreate {
  email: string;
  displayName: string;
  password: string;
}

/**
 * Payload for user login.
 */
export interface IUserLogin {
  email: string;
  password: string;
}

/**
 * Public-facing user profile (excludes internal id).
 */
export type IUserProfile = Omit<IUser, 'id'>;
