import axios from 'axios';
import type { IApiResponse } from '@dear-days/shared';

/**
 * Axios instance pre-configured with base URL and interceptors.
 */
const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Request interceptor — attach Bearer token from localStorage.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Response interceptor — unwrap IApiResponse envelope, handle 401.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

/**
 * Typed API client wrapping Axios.
 * All methods return the unwrapped IApiResponse<T>.
 */
export const apiClient = {
  async get<T>(path: string): Promise<IApiResponse<T>> {
    const { data } = await api.get<IApiResponse<T>>(path);
    return data;
  },

  async post<T>(path: string, body?: unknown): Promise<IApiResponse<T>> {
    const { data } = await api.post<IApiResponse<T>>(path, body);
    return data;
  },

  async put<T>(path: string, body?: unknown): Promise<IApiResponse<T>> {
    const { data } = await api.put<IApiResponse<T>>(path, body);
    return data;
  },

  async delete<T>(path: string): Promise<IApiResponse<T>> {
    const { data } = await api.delete<IApiResponse<T>>(path);
    return data;
  },
};

export default api;
