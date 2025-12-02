/**
 * Advanced Rate Limiter with Dual Gating Control
 * Implements semaphore + token bucket for optimal API request management
 * Based on SolanaMCP best practices for RPC optimization
 */

export interface RateLimiterConfig {
  maxConcurrent: number;     // Semaphore: max in-flight requests
  requestsPerSecond: number; // Token bucket: refill rate
  maxRetries: number;        // Maximum retry attempts
  baseDelay: number;       // Base delay for exponential backoff (ms)
}

export interface QueuedRequest<T> {
  id: string;
  execute: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
  retries: number;
  timestamp: number;
}

export class RateLimiter {
  private config: RateLimiterConfig;
  private semaphore: number;
  private tokens: number;
  private lastRefill: number;
  private queue: QueuedRequest<unknown>[] = [];
  private isProcessing = false;

  constructor(config: RateLimiterConfig = {
    maxConcurrent: 10,
    requestsPerSecond: 5,
    maxRetries: 3,
    baseDelay: 1000
  }) {
    this.config = config;
    this.semaphore = config.maxConcurrent;
    this.tokens = config.requestsPerSecond;
    this.lastRefill = Date.now();
  }

  /**
   * Execute a request with rate limiting and retry logic
   */
  async execute<T>(requestFn: () => Promise<T>, requestId?: string): Promise<T> {
    const id = requestId || this.generateRequestId();
    
    return new Promise<T>((resolve, reject) => {
      const queuedRequest: QueuedRequest<unknown> = {
        id,
        execute: requestFn as () => Promise<unknown>,
        resolve: resolve as (value: unknown) => void,
        reject: reject as (error: unknown) => void,
        retries: 0,
        timestamp: Date.now()
      };

      this.queue.push(queuedRequest);
      this.processQueue();
    });
  }

  /**
   * Process the request queue with dual gating
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.queue.length > 0) {
      // Refill tokens based on elapsed time
      this.refillTokens();

      // Check both semaphore and token bucket
      if (this.semaphore <= 0 || this.tokens < 1) {
        // Wait for available capacity
        const waitTime = this.calculateWaitTime();
        await this.sleep(waitTime);
        continue;
      }

      // Acquire resources
      this.semaphore--;
      this.tokens--;

      const request = this.queue.shift()!;
      
      try {
        const result = await this.executeRequest(request);
        request.resolve(result);
      } catch (error) {
        request.reject(error);
      } finally {
        // Release semaphore
        this.semaphore++;
      }
    }

    this.isProcessing = false;
  }

  /**
   * Execute individual request with retry logic
   */
  private async executeRequest<T>(request: QueuedRequest<T>): Promise<T> {
    try {
      return await request.execute();
    } catch (error) {
      // Check if error is retryable (429, 5xx errors)
      if (this.isRetryableError(error) && request.retries < this.config.maxRetries) {
        request.retries++;
        
        // Exponential backoff
        const delay = this.config.baseDelay * Math.pow(2, request.retries - 1);
        await this.sleep(delay);
        
        // Re-queue the request
        this.queue.unshift(request as QueuedRequest<unknown>);
        this.processQueue();
        
        // Return a promise that will be resolved when reprocessed
        return new Promise<T>((resolve, reject) => {
          const originalResolve = request.resolve;
          const originalReject = request.reject;
          
          request.resolve = (value) => {
            originalResolve(value);
            resolve(value);
          };
          
          request.reject = (err) => {
            originalReject(err);
            reject(err);
          };
        });
      }
      
      throw error;
    }
  }

  /**
   * Refill tokens based on elapsed time
   */
  private refillTokens(): void {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000; // Convert to seconds
    const tokensToAdd = Math.floor(elapsed * this.config.requestsPerSecond);
    
    if (tokensToAdd > 0) {
      this.tokens = Math.min(this.config.requestsPerSecond, this.tokens + tokensToAdd);
      this.lastRefill = now;
    }
  }

  /**
   * Calculate wait time for next available slot
   */
  private calculateWaitTime(): number {
    const tokenWaitTime = this.tokens < 1 ? (1 - this.tokens) / this.config.requestsPerSecond * 1000 : 0;
    const semaphoreWaitTime = this.semaphore <= 0 ? 100 : 0; // Estimate 100ms per request
    
    return Math.max(tokenWaitTime, semaphoreWaitTime);
  }

  /**
   * Check if error is retryable
   */
  private isRetryableError(error: unknown): boolean {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      const isRateLimit = message.includes('429') || message.includes('rate limit');
      const isServerError = message.includes('5') && (message.includes('error') || message.includes('failed'));
      const isNetworkError = message.includes('network') || message.includes('timeout');
      
      return isRateLimit || isServerError || isNetworkError;
    }
    return false;
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get current statistics
   */
  getStats(): {
    queueLength: number;
    activeRequests: number;
    availableTokens: number;
    availableSlots: number;
  } {
    this.refillTokens();
    
    return {
      queueLength: this.queue.length,
      activeRequests: this.config.maxConcurrent - this.semaphore,
      availableTokens: this.tokens,
      availableSlots: this.semaphore
    };
  }

  /**
   * Clear the queue (emergency reset)
   */
  clearQueue(): void {
    this.queue.forEach(request => {
      request.reject(new Error('Queue cleared'));
    });
    this.queue = [];
    this.semaphore = this.config.maxConcurrent;
    this.tokens = this.config.requestsPerSecond;
    this.lastRefill = Date.now();
  }
}

/**
 * Singleton instance with optimized defaults for Solana dApps
 */
export const rateLimiter = new RateLimiter({
  maxConcurrent: 5,        // Conservative for browser environments
  requestsPerSecond: 2,    // Respectful rate for free tier APIs
  maxRetries: 3,           // Standard retry count
  baseDelay: 2000          // Higher base delay for better recovery
});

/**
 * Enhanced API service wrapper with rate limiting
 */
export async function withRateLimit<T>(
  requestFn: () => Promise<T>,
  requestId?: string
): Promise<T> {
  return rateLimiter.execute(requestFn, requestId);
}