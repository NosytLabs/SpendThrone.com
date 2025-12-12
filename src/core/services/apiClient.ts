import { logError } from '@/shared/utils/logger';

interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  timeout?: number;
  retries?: number;
  authToken?: string;
}

class ApiClient {
  private baseUrl: string;
  private requestQueue = new Map<string, Promise<unknown>>();
  private rateLimiter = new Map<string, number>();
  private readonly RATE_LIMIT_WINDOW = 60000; // 1 minute
  private readonly MAX_REQUESTS_PER_WINDOW = 100;
  private readonly DEFAULT_TIMEOUT = 30000; // 30 seconds
  private readonly MAX_RETRIES = 3;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  private validateUrl(url: string): void {
    try {
      new URL(url);
    } catch {
      if (!url.startsWith('/') && !url.startsWith('http')) {
        throw new Error('Invalid URL format');
      }
    }
  }

  private sanitizeData(data: unknown): string {
    if (data === null || data === undefined) {
      return '';
    }
    
    try {
      const sanitized = JSON.parse(JSON.stringify(data, (_key, value) => {
        // Remove potential XSS vectors
        if (typeof value === 'string') {
          return value.replace(/<script[^>]*>.*?<\/script>/gi, '');
        }
        return value;
      }));
      return JSON.stringify(sanitized);
    } catch (error) {
      throw new Error('Invalid data format for request body');
    }
  }

  private checkRateLimit(endpoint: string): void {
    const key = endpoint.split('?')[0]; // Rate limit by base endpoint
    const now = Date.now();
    const windowStart = now - this.RATE_LIMIT_WINDOW;
    
    // Clean up old entries
    for (const [k, timestamp] of this.rateLimiter.entries()) {
      if (timestamp < windowStart) {
        this.rateLimiter.delete(k);
      }
    }
    
    const requestCount = Array.from(this.rateLimiter.values())
      .filter(timestamp => timestamp > windowStart && this.rateLimiter.get(key) === timestamp)
      .length;
    
    if (requestCount >= this.MAX_REQUESTS_PER_WINDOW) {
      throw new Error('Rate limit exceeded');
    }
    
    this.rateLimiter.set(key, now);
  }

  private createAbortController(timeout: number): AbortController {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), timeout);
    return controller;
  }

  private async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const { params, timeout = this.DEFAULT_TIMEOUT, retries = this.MAX_RETRIES, authToken, ...customConfig } = config;
    
    // Validate endpoint
    let url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
    this.validateUrl(url);
    
    // Rate limiting
    this.checkRateLimit(endpoint);

    // Build URL with params
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const separator = url.includes('?') ? '&' : '?';
      url += `${separator}${searchParams.toString()}`;
    }

    // Request deduplication
    const cacheKey = `${url}:${JSON.stringify(customConfig)}`;
    if (this.requestQueue.has(cacheKey)) {
      return this.requestQueue.get(cacheKey)! as Promise<T>;
    }

    const headers = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest', // CSRF protection
      ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
      ...(customConfig.headers || {}),
    };

    const requestPromise = this.executeRequest<T>(url, {
      ...customConfig,
      headers,
      signal: this.createAbortController(timeout).signal,
    }, retries);

    this.requestQueue.set(cacheKey, requestPromise);
    
    try {
      const result = await requestPromise;
      return result;
    } finally {
      this.requestQueue.delete(cacheKey);
    }
  }

  private async executeRequest<T>(url: string, config: RequestInit, retries: number): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Invalid response content type');
        }
        
        const data = await response.json();
        return data as T;
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on client errors (4xx) or abort errors
        if (error instanceof Error && 
            (error.name === 'AbortError' || 
             (error.message.includes('API Error:') && error.message.includes(' 4')))) {
          break;
        }
        
        if (attempt < retries) {
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }
    
    logError(`Request failed after ${retries + 1} attempts: ${url}`, lastError!);
    throw lastError!;
  }

  get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  post<T, D = unknown>(endpoint: string, data?: D, config?: RequestConfig): Promise<T> {
    const sanitizedBody = data ? this.sanitizeData(data) : undefined;
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: sanitizedBody,
    });
  }

  put<T, D = unknown>(endpoint: string, data?: D, config?: RequestConfig): Promise<T> {
    const sanitizedBody = data ? this.sanitizeData(data) : undefined;
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: sanitizedBody,
    });
  }

  delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
