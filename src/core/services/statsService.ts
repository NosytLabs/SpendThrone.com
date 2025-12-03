// import { apiClient } from './apiClient';
import { debugLog } from '@/shared/utils/logger';

export interface MarketData {
  totalValue: number;
  totalUsers: number;
  totalTransactions: number;
  averageDeposit: number;
}

export interface LeaderboardEntry {
  walletAddress: string;
  totalUsdValue: number;
  displayName: string;
  rank: number;
  tier: string;
  transactionCount: number;
  timeAgo: string;
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

class StatsService {
  private static instance: StatsService;

  private constructor() {}

  static getInstance(): StatsService {
    if (!StatsService.instance) {
      StatsService.instance = new StatsService();
    }
    return StatsService.instance;
  }

  /**
   * Get market data for home page
   */
  async getMarketData(): Promise<MarketData> {
    // TODO: Replace with real API call
    // const response = await apiClient.get<MarketData>('/api/market/stats');
    
    return Promise.resolve({
      totalValue: 123456789,
      totalUsers: 9876,
      totalTransactions: 1234567,
      averageDeposit: 1234.56,
    });
  }

  /**
   * Get leaderboard data
   */
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    try {
      // Try to get real leaderboard data from backend API
      // const response = await apiClient.get<LeaderboardEntry[]>('/api/leaderboard');
      // return response || [];
      throw new Error('Not implemented');
    } catch (error) {
      debugLog('Failed to fetch leaderboard, using fallback mock');
      return [
        { walletAddress: '8x2...9s8d', totalUsdValue: 5000, displayName: 'WhaleKing', rank: 1, tier: 'Diamond Emperor', transactionCount: 12, timeAgo: '2h ago' },
        { walletAddress: '3j1...k92s', totalUsdValue: 1200, displayName: 'SolDegen', rank: 2, tier: 'Gold King', transactionCount: 5, timeAgo: '5h ago' }
      ];
    }
  }

  /**
   * Get user specific stats
   */
  async getUserStats(walletAddress: string): Promise<UserStatsResponse> {
    try {
      debugLog(`Fetching user stats for ${walletAddress}`);
      
      // Try to get real user stats from backend API
      // const response = await apiClient.get<UserStatsResponse>(`/api/user/${walletAddress}/stats`);
      
      // if (response) return response;
      throw new Error('Not implemented');
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

  /**
   * Get referral stats
   */
  async getReferralStats(publicKey: string): Promise<Record<string, number>> {
    debugLog(`Fetching referrals for ${publicKey}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      referralCount: Math.floor(Math.random() * 5),
      totalReferralVolume: Math.floor(Math.random() * 1000),
      earnings: Math.floor(Math.random() * 50)
    };
  }

  /**
   * Get user settings
   */
  async getSettings(walletAddress: string): Promise<Record<string, unknown>> {
    try {
      debugLog(`Fetching settings for ${walletAddress}`);
      
      // Try to get real user settings from backend API
      // const response = await apiClient.get<Record<string, unknown>>(`/api/user/${walletAddress}/settings`);
      // return response || {};
      return {};
    } catch (error) {
      debugLog(`Failed to fetch settings for ${walletAddress}, returning empty object`);
      return {};
    }
  }

  async getTiers(): Promise<unknown[]> {
    // This is a placeholder for a real tiers API
    return Promise.resolve([]);
  }
}

export const statsService = StatsService.getInstance();
