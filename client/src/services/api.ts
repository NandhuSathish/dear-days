import type { IApiResponse } from '@dear-days/shared';

const BASE_URL = '';

/**
 * Retrieves the stored auth token from localStorage.
 * @returns The JWT token or null if not found.
 */
function getToken(): string | null {
  return localStorage.getItem('accessToken');
}

/**
 * Builds headers for API requests, including auth token if available.
 * @param hasBody - Whether the request includes a JSON body.
 * @returns Headers object for fetch.
 */
function buildHeaders(hasBody: boolean): HeadersInit {
  const headers: Record<string, string> = {};
  if (hasBody) {
    headers['Content-Type'] = 'application/json';
  }
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Processes the fetch response and returns a typed API response.
 * @param response - The raw fetch response.
 * @returns Parsed IApiResponse.
 * @throws Error if the response indicates failure.
 */
async function handleResponse<T>(response: Response): Promise<IApiResponse<T>> {
  const data: IApiResponse<T> = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }
  return data;
}

/**
 * Centralized API client wrapping native fetch.
 * Automatically handles JSON serialization, auth headers, and error responses.
 */
export const apiClient = {
  /**
   * Sends a GET request.
   * @param path - API endpoint path (e.g., "/api/v1/journals").
   */
  async get<T>(path: string): Promise<IApiResponse<T>> {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'GET',
      headers: buildHeaders(false),
    });
    return handleResponse<T>(response);
  },

  /**
   * Sends a POST request with a JSON body.
   * @param path - API endpoint path.
   * @param body - Request payload.
   */
  async post<T>(path: string, body: unknown): Promise<IApiResponse<T>> {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: buildHeaders(true),
      body: JSON.stringify(body),
    });
    return handleResponse<T>(response);
  },

  /**
   * Sends a PUT request with a JSON body.
   * @param path - API endpoint path.
   * @param body - Request payload.
   */
  async put<T>(path: string, body: unknown): Promise<IApiResponse<T>> {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'PUT',
      headers: buildHeaders(true),
      body: JSON.stringify(body),
    });
    return handleResponse<T>(response);
  },

  /**
   * Sends a PATCH request with a JSON body.
   * @param path - API endpoint path.
   * @param body - Request payload.
   */
  async patch<T>(path: string, body: unknown): Promise<IApiResponse<T>> {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'PATCH',
      headers: buildHeaders(true),
      body: JSON.stringify(body),
    });
    return handleResponse<T>(response);
  },

  /**
   * Sends a DELETE request.
   * @param path - API endpoint path.
   */
  async delete<T>(path: string): Promise<IApiResponse<T>> {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'DELETE',
      headers: buildHeaders(false),
    });
    return handleResponse<T>(response);
  },
};
