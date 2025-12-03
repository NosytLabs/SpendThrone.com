import { logError } from '@/shared/utils/logger';

interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const { params, ...customConfig } = config;
    let url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
      const separator = url.includes('?') ? '&' : '?';
      url += `${separator}${searchParams.toString()}`;
    }

    const headers = {
      'Content-Type': 'application/json',
      ...(customConfig.headers || {}),
    };

    try {
      const response = await fetch(url, {
        ...customConfig,
        headers,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      logError(`Request failed: ${url}`, error);
      throw error;
    }
  }

  get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  post<T, D = unknown>(endpoint: string, data?: D, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put<T, D = unknown>(endpoint: string, data?: D, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
