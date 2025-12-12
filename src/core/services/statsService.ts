import { debugLog } from '@/shared/utils/logger';
import { databaseService } from '@/core/services/databaseService';
import { getTierByUsd } from '@/shared/utils/tierSystem';
import { LeaderboardEntry } from '@/shared/utils/types';
import { generateMockLeaderboard } from '@/core/data/mockLeaderboardData';

// Generate mock market data locally since we removed the duplicate file
const MOCK_MARKET_DATA = {
  totalValue: 12450982,
  totalUsers: 8942,
  totalTransactions: 45231,
  averageDeposit: 1392.45,
};

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
  message?: string;
  link?: string;
  customLinks?: { label: string; url: string }[];
  customSections?: { title: string; content: string }[];
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
    return MOCK_MARKET_DATA;
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
    return generateMockLeaderboard(50);
  }

  /**
   * Get the current #1 Emperor
   */
  async getTopEmperor(): Promise<LeaderboardEntry | null> {
    try {
      const leaderboard = await this.getLeaderboard();
      return leaderboard.length > 0 ? leaderboard[0] : null;
    } catch (error) {
      return null;
    }
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
            totalUsdValue: entry.total_usd_value,
            message: entry.message || undefined,
            link: entry.link || undefined,
            customLinks: entry.custom_links,
            customSections: entry.custom_sections
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
    
    try {
      if (databaseService.isAvailable()) {
        const { count, volume } = await databaseService.getReferralStats(publicKey);
        return {
          referralCount: count,
          totalReferralVolume: volume,
          earnings: 0 // "Divine Favor" only, no earnings for now
        };
      }
    } catch (error) {
      debugLog(`Failed to fetch referral stats for ${publicKey}`, error);
    }

    return {
      referralCount: 0,
      totalReferralVolume: 0,
      earnings: 0
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
}

export const statsService = StatsService.getInstance();
