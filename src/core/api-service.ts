/**
 * Professional Web3 API Service with Error Handling
 * Handles external API calls with proper fallbacks and error management
 */

import { debugLog } from '@/shared/utils/logger';
import { apiConfig } from './config';
import { withRateLimit } from './utils/rateLimiter';

export interface PriceData {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  lastUpdated: number;
  source: 'jupiter' | 'coingecko' | 'fallback';
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
  retryable: boolean;
}

// API Response Interfaces
export interface JupiterPriceResponse {
  data?: {
    So11111111111111111111111111111111111111112?: {
      price: number;
      change24h?: number;
      volume24h?: number;
      marketCap?: number;
    };
  };
}

export interface CoinGeckoPriceResponse {
  solana?: {
    usd: number;
    usd_24h_change?: number;
    usd_24h_vol?: number;
    usd_market_cap?: number;
  };
}

export interface UserStatsResponse {
  totalBalance?: number;
  totalEarned?: number;
  activeStakes?: number;
  globalRank?: number;
  currentTier?: string;
  tier?: string;
  rank?: number;
}

export interface LeaderboardResponse {
  // Define actual leaderboard structure when available
  [key: string]: unknown;
}

export interface UserSettingsResponse {
  // Define actual settings structure when available
  [key: string]: unknown;
}

export class ApiService {
  private static instance: ApiService;

  // API endpoints with fallbacks
  private readonly endpoints = apiConfig;

  // Cache for API responses
  private cache = new Map<string, { data: unknown; timestamp: number; ttl: number }>();

  // Request queue for rate limiting
  private requestQueue = new Set<string>();

  private constructor() {}

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }



  /**
   * Get SOL price with multiple fallback sources and aggressive caching
   */
  async getSolPrice(): Promise<PriceData> {
    const cacheKey = 'sol_price';
    const cached = this.cache.get(cacheKey);
    
    // Return cached data if fresh (30 seconds TTL)
    if (cached && Date.now() - cached.timestamp < 30000) {
      return cached.data as PriceData;
    }

    try {
      // Try CoinGecko first (lighter API)
      const coingeckoResponse = await this.get<CoinGeckoPriceResponse>(`${this.endpoints.coingecko.price}?ids=solana&vs_currencies=usd&include_24hr_change=true`);
      if (coingeckoResponse?.solana?.usd) {
        const priceData: PriceData = {
          symbol: 'SOL',
          price: coingeckoResponse.solana.usd,
          change24h: coingeckoResponse.solana.usd_24h_change || 0,
          volume24h: coingeckoResponse.solana.usd_24h_vol || 0,
          marketCap: coingeckoResponse.solana.usd_market_cap || 0,
          lastUpdated: Date.now(),
          source: 'coingecko',
        };
        
        // Cache the result
        this.cache.set(cacheKey, { data: priceData, timestamp: Date.now(), ttl: 30000 });
        return priceData;
      }
    } catch (error) {
      debugLog('CoinGecko API failed, trying Jupiter fallback');
    }

    try {
      // Fallback to Jupiter API (only if CoinGecko fails)
      const jupiterResponse = await this.get<JupiterPriceResponse>(`${this.endpoints.jupiter.price}?ids=So11111111111111111111111111111111111111112`);
      if (jupiterResponse?.data?.So11111111111111111111111111111111111111112?.price) {
        const priceData: PriceData = {
          symbol: 'SOL',
          price: jupiterResponse.data.So11111111111111111111111111111111111111112.price,
          change24h: jupiterResponse.data.So11111111111111111111111111111111111111112.change24h || 0,
          volume24h: 0,
          marketCap: 0,
          lastUpdated: Date.now(),
          source: 'jupiter',
        };
        
        // Cache the result
        this.cache.set(cacheKey, { data: priceData, timestamp: Date.now(), ttl: 30000 });
        return priceData;
      }
    } catch (error) {
      debugLog('Jupiter API failed, using fallback price');
    }

    // Ultimate fallback
    const fallbackData: PriceData = {
      symbol: 'SOL',
      price: this.endpoints.fallback.solPrice,
      change24h: 0,
      volume24h: 0,
      marketCap: 0,
      lastUpdated: Date.now(),
      source: 'fallback',
    };
    
    // Cache fallback for shorter time (10 seconds)
    this.cache.set(cacheKey, { data: fallbackData, timestamp: Date.now(), ttl: 10000 });
    return fallbackData;
  }

  /**
   * Get multiple token prices
   */
  async getTokenPrices(tokens: string[] = ['SOL']): Promise<Map<string, PriceData>> {
    const results = new Map<string, PriceData>();
    
    // Fallback implementation - get SOL price and apply to all tokens
    try {
      const solPrice = await this.getSolPrice();
      tokens.forEach(token => {
        results.set(token, {
          ...solPrice,
          symbol: token,
          source: 'fallback'
        });
      });
    } catch (error) {
      // Return empty map on error
      debugLog('Failed to fetch token prices:', error);
    }
    
    return results;
  }

  /**
   * Get market data for leaderboard calculations
   */
  async getMarketData(): Promise<Record<string, number>> {
    // This is a placeholder for a real market data API
    return Promise.resolve({
      totalValue: 123456789,
      totalUsers: 9876,
      totalTransactions: 1234567,
      averageDeposit: 1234.56,
    });
  }

  async getUserStats(walletAddress: string): Promise<Record<string, number | string>> {
    try {
      debugLog(`Fetching user stats for ${walletAddress}`);
      
      // Try to get real user stats from backend API
      const response = await this.get<UserStatsResponse>(`/api/user/${walletAddress}/stats`);
      
      if (response && typeof response === 'object') {
        return {
          totalBalance: response.totalBalance || 0,
          totalEarned: response.totalEarned || 0,
          activeStakes: response.activeStakes || 0,
          globalRank: response.globalRank || 0,
          currentTier: response.currentTier || 'Bronze',
          tier: response.tier || 'Bronze',
          rank: response.rank || 0,
        };
      }
    } catch (error) {
      debugLog(`Failed to fetch user stats for ${walletAddress}, using fallback`);
    }

    // Fallback to mock data if API fails
    return {
      totalBalance: 0,
      totalEarned: 0,
      activeStakes: 0,
      globalRank: 0,
      currentTier: 'Bronze',
      tier: 'Bronze',
      rank: 0,
    };
  }

  async getLeaderboard(): Promise<unknown> {
    try {
      // Try to get real leaderboard data from backend API
      const response = await this.get<LeaderboardResponse[]>('/api/leaderboard');
      return response || [];
    } catch (error) {
      debugLog('Failed to fetch leaderboard, using fallback mock');
      // Fallback mock if API fails (e.g. local dev without Vercel functions running)
      return [
        { walletAddress: '8x2...9s8d', totalUsdValue: 5000, displayName: 'WhaleKing', rank: 1, tier: 'Diamond Emperor', transactionCount: 12, timeAgo: '2h ago' },
        { walletAddress: '3j1...k92s', totalUsdValue: 1200, displayName: 'SolDegen', rank: 2, tier: 'Gold King', transactionCount: 5, timeAgo: '5h ago' }
      ];
    }
  }

  async getReferralStats(publicKey: string): Promise<Record<string, number>> {
    // Mock data for referrals since backend is not available yet
    debugLog(`Fetching referrals for ${publicKey}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data
    return {
      referralCount: Math.floor(Math.random() * 5),
      totalReferralVolume: Math.floor(Math.random() * 1000),
      earnings: Math.floor(Math.random() * 50)
    };
    /* 
    try {
      return await this.get(`/api/referrals?publicKey=${publicKey}`);
    } catch (error) {
      debugLog('Failed to fetch referrals', error);
      return { referralCount: 0, totalReferralVolume: 0, earnings: 0 };
    }
    */
  }

  async getTiers(): Promise<unknown[]> {
    // This is a placeholder for a real tiers API
    return Promise.resolve([]);
  }

  async getSettings(walletAddress: string): Promise<UserSettingsResponse> {
    try {
      debugLog(`Fetching settings for ${walletAddress}`);
      
      // Try to get real user settings from backend API
      const response = await this.get<UserSettingsResponse>(`/api/user/${walletAddress}/settings`);
      return response || {};
    } catch (error) {
      debugLog(`Failed to fetch settings for ${walletAddress}, returning empty object`);
      return {};
    }
  }

  async getDepositHistory(walletAddress: string): Promise<unknown[]> {
    // Fallback deposit history with sample data
    debugLog(`Fetching deposit history for ${walletAddress}`);
    return Promise.resolve([
      {
        id: '1',
        amount: 1.5,
        timestamp: Date.now() - 86400000,
        status: 'confirmed',
        txSignature: 'sample-tx-1'
      },
      {
        id: '2', 
        amount: 2.3,
        timestamp: Date.now() - 172800000,
        status: 'confirmed',
        txSignature: 'sample-tx-2'
      }
    ]);
  }

  /**
   * Health check for API services
   */
  async healthCheck(): Promise<unknown> {
    // This is a placeholder for a real health check API
    return Promise.resolve({ status: 'ok' });
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    this.requestQueue.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
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

// Export singleton instance
export const apiService = ApiService.getInstance();