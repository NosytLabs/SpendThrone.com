import { debugLog } from '@/shared/utils/logger';
import { databaseService } from '@/core/services/databaseService';
import { getTierByUsd } from '@/shared/utils/tierSystem';
import { LeaderboardEntry } from '@/shared/utils/types';

export interface MarketData {
  totalValue: number;
  totalUsers: number;
  totalTransactions: number;
  averageDeposit: number;
}

export interface UserStatsResponse {
  totalBalance?: number;
  totalEarned?: number;
  activeStakes?: number;
  globalRank?: number;
  currentTier?: string;
  tier?: string;
  rank?: number;
  totalDeposits?: number;
  totalUsdValue?: number;
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
    try {
      if (databaseService.isAvailable()) {
        const stats = await databaseService.getLeaderboardStats();
        return {
          totalValue: stats.totalVolume,
          totalUsers: stats.totalUsers,
          totalTransactions: 0, // Not currently tracked in aggregate
          averageDeposit: stats.averageDeposit,
        };
      }
    } catch (error) {
      debugLog('Failed to fetch market data from database', error);
    }

    // Fallback mock data
    return {
      totalValue: 123456789,
      totalUsers: 9876,
      totalTransactions: 1234567,
      averageDeposit: 1234.56,
    };
  }

  /**
   * Get leaderboard data
   */
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    try {
      if (databaseService.isAvailable()) {
        return await databaseService.getLeaderboard();
      }
    } catch (error) {
      debugLog('Failed to fetch leaderboard from database', error);
    }

    // Fallback mock data
    return [
      { walletAddress: '8x2...9s8d', totalUsdValue: 5000, displayName: 'WhaleKing', rank: 1, tier: 'Diamond Emperor', transactionCount: 12, timeAgo: '2h ago' },
      { walletAddress: '3j1...k92s', totalUsdValue: 1200, displayName: 'SolDegen', rank: 2, tier: 'Gold King', transactionCount: 5, timeAgo: '5h ago' }
    ];
  }

  /**
   * Get user specific stats
   */
  async getUserStats(walletAddress: string): Promise<UserStatsResponse> {
    try {
      if (databaseService.isAvailable()) {
        const entry = await databaseService.getUserLeaderboardEntry(walletAddress);
        if (entry) {
          const tier = getTierByUsd(entry.total_usd_value);
          const rank = await databaseService.getRankForUser(walletAddress);
          
          return {
            totalBalance: 0, // Wallet balance not tracked in DB
            totalEarned: 0,
            activeStakes: 0,
            globalRank: rank,
            currentTier: tier,
            tier: tier,
            rank: rank,
            totalDeposits: entry.transaction_count,
            totalUsdValue: entry.total_usd_value
          };
        }
      }
    } catch (error) {
      debugLog(`Failed to fetch user stats for ${walletAddress}`, error);
    }

    // Fallback to mock data
    return {
      totalBalance: 0,
      totalEarned: 0,
      activeStakes: 0,
      globalRank: 0,
      currentTier: 'Bronze',
      tier: 'Bronze',
      rank: 0,
      totalDeposits: 0,
      totalUsdValue: 0
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
   * Get user settings (and stats for useSettings hook)
   */
  async getSettings(walletAddress: string): Promise<Record<string, unknown>> {
    try {
      if (databaseService.isAvailable()) {
        const entry = await databaseService.getUserLeaderboardEntry(walletAddress);
        if (entry) {
          const tier = getTierByUsd(entry.total_usd_value);
          return {
            displayName: entry.display_name,
            userStats: {
              totalDeposits: entry.transaction_count,
              totalUsdValue: entry.total_usd_value,
              rank: null, // We don't have rank in single entry fetch
              tier: tier
            }
          };
        }
      }
    } catch (error) {
      debugLog(`Failed to fetch settings for ${walletAddress}`, error);
    }
    return {};
  }

  async getTiers(): Promise<unknown[]> {
    // This is a placeholder for a real tiers API
    return Promise.resolve([]);
  }
}

export const statsService = StatsService.getInstance();
