import { withRateLimit } from '../utils/rateLimiter';

/**
 * Generic API Client with rate limiting
 */
class ApiClient {
  private static instance: ApiClient;

  private constructor() {}

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  /**
   * Generic GET request method with rate limiting
   */
  async get<T>(url: string, options?: RequestInit): Promise<T> {
    return withRateLimit(async () => {
      const response = await fetch(url, {
        method: 'GET',
        ...options
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    }, `get_${url}`);
  }

  /**
   * Generic POST request method with rate limiting
   */
  async post<T, B>(url: string, body: B, options?: RequestInit): Promise<T> {
    return withRateLimit(async () => {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers
        },
        body: JSON.stringify(body),
        ...options
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    }, `post_${url}`);
  }
}

export const apiClient = ApiClient.getInstance();
