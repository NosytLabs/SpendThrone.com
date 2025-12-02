import { supabase } from '@/core/database/supabase';
import { LeaderboardRecord } from '@/core/database/supabase';
import { createErrorHandler, ErrorMessages } from '@/shared/utils/errorHandler';
import { debugLog } from '@/shared/utils/logger';
import { LeaderboardEntry } from '@/shared/utils/types';
import { getTierByUsd } from '@/shared/utils/tierSystem';

// Mock data generator
async function getMockLeaderboardData(limit = 50): Promise<LeaderboardEntry[]> {
  const mockData: LeaderboardEntry[] = [
    {
      rank: 1,
      walletAddress: '31M5mtQ2T1B4K9rPieLoiTncDUGWVwgBdiJYm8RhsJCo',
      displayName: 'KingSolana',
      totalUsdValue: 5420.50,
      tier: 'legendary',
      transactionCount: 15,
      timeAgo: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      message: 'Long live the King! 👑',
      link: 'https://twitter.com/solana'
    },
    {
      rank: 2,
      walletAddress: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
      displayName: 'CryptoWhale',
      totalUsdValue: 3890.25,
      tier: 'legendary',
      transactionCount: 23,
      timeAgo: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      message: 'Catch me if you can 🚀',
      link: 'https://spendthrone.com'
    },
    // Add a few more basics
    {
      rank: 3,
      walletAddress: 'GdNBHNfG6HgjhE4a1uKvT5sVx8RWN8H8fVJH8sWkPg6C',
      displayName: 'DeFiKnight',
      totalUsdValue: 2150.75,
      tier: 'epic',
      transactionCount: 8,
      timeAgo: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    }
  ];

  // Fill the rest
  while (mockData.length < limit) {
    const baseRank = mockData.length + 1;
    const randomValue = Math.random() * 100 + 10;
    const tier = getTierByUsd(randomValue);

    mockData.push({
      rank: baseRank,
      walletAddress: `${baseRank}MockWallet${baseRank}xxxxxxxxxxxxxxxxxxxxxxxxxx`,
      totalUsdValue: randomValue,
      tier: tier,
      transactionCount: Math.floor(Math.random() * 5) + 1,
      timeAgo: new Date(Date.now() - (Math.random() * 24 * 60 * 60 * 1000)).toISOString()
    });
  }

  return mockData.slice(0, limit);
}

export interface DatabaseError extends Error {
  code?: string;
  details?: string;
  hint?: string;
}

export class DatabaseService {
  private static instance: DatabaseService;
  private errorHandler = createErrorHandler(
    (error) => debugLog('DatabaseService error:' + error, 'error'),
    'DatabaseService'
  );

  private constructor() {}

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  /**
   * Check if database is available
   */
  isAvailable(): boolean {
    return supabase !== null;
  }

  /**
   * Get leaderboard entries ordered by USD value
   */
  async getLeaderboard(limit = 50): Promise<LeaderboardEntry[]> {
    if (!this.isAvailable()) {
      debugLog('Database not available, using mock data', 'warn');
      return getMockLeaderboardData(limit);
    }

    try {
      const { data, error } = await supabase!
        .from('leaderboard')
        .select('*')
        .order('total_usd_value', { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(error.message);
      }
      
      if (!data || data.length === 0) {
         return getMockLeaderboardData(limit);
      }

      return data.map((record, index) => ({
        rank: index + 1,
        walletAddress: record.wallet_address,
        displayName: record.display_name || undefined,
        totalUsdValue: record.total_usd_value,
        tier: getTierByUsd(record.total_usd_value),
        transactionCount: record.transaction_count,
        timeAgo: record.last_activity || record.created_at,
        message: record.message || undefined,
        link: record.link || undefined
      }));
    } catch (error) {
      this.errorHandler.handleError(error, {
        context: 'getLeaderboard',
        fallbackMessage: ErrorMessages.API_ERROR
      });
      // Fallback to mock data
      return getMockLeaderboardData(limit);
    }
  }

  /**
   * Get a specific user's leaderboard entry
   */
  async getUserLeaderboardEntry(walletAddress: string): Promise<LeaderboardRecord | null> {
    if (!this.isAvailable()) {
      throw new Error('Database not available');
    }

    try {
      const { data, error } = await supabase!
        .from('leaderboard')
        .select('*')
        .eq('wallet_address', walletAddress)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows found
          return null;
        }
        throw new Error(ErrorMessages.API_ERROR);
      }

      return data;
    } catch (error) {
      this.errorHandler.handleError(error, {
        context: 'getUserLeaderboardEntry',
        fallbackMessage: ErrorMessages.API_ERROR
      });
      throw error;
    }
  }

  /**
   * Update or create a leaderboard entry
   */
  async upsertLeaderboardEntry(
    walletAddress: string,
    usdValue: number,
    options?: {
      displayName?: string;
      message?: string;
      link?: string;
      incrementTransactions?: boolean;
    }
  ): Promise<void> {
    if (!this.isAvailable()) {
      throw new Error('Database not available');
    }

    try {
      // First, check if entry exists
      const existingEntry = await this.getUserLeaderboardEntry(walletAddress);

      if (existingEntry) {
        // Update existing entry
        const updates: Partial<LeaderboardRecord> = {
          total_usd_value: existingEntry.total_usd_value + usdValue,
          last_activity: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        if (options?.displayName) updates.display_name = options.displayName;
        if (options?.message) updates.message = options.message;
        if (options?.link) updates.link = options.link;
        if (options?.incrementTransactions) {
          updates.transaction_count = (existingEntry.transaction_count || 0) + 1;
        }

        const { error } = await supabase!
          .from('leaderboard')
          .update(updates)
          .eq('wallet_address', walletAddress);

        if (error) {
          throw new Error(ErrorMessages.API_ERROR);
        }
      } else {
        // Create new entry
        const newEntry: Partial<LeaderboardRecord> = {
          wallet_address: walletAddress,
          display_name: options?.displayName || null,
          total_usd_value: usdValue,
          transaction_count: options?.incrementTransactions ? 1 : 0,
          last_activity: new Date().toISOString(),
          message: options?.message || null,
          link: options?.link || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { error } = await supabase!
          .from('leaderboard')
          .insert(newEntry);

        if (error) {
          throw new Error(ErrorMessages.API_ERROR);
        }
      }
    } catch (error) {
      this.errorHandler.handleError(error, {
        context: 'upsertLeaderboardEntry',
        fallbackMessage: ErrorMessages.API_ERROR
      });
      throw error;
    }
  }

  /**
   * Reset a user's leaderboard entry (set USD value to 0)
   */
  async resetLeaderboardEntry(walletAddress: string): Promise<void> {
    if (!this.isAvailable()) {
      throw new Error('Database not available');
    }

    try {
      const { error } = await supabase!
        .from('leaderboard')
        .update({
          total_usd_value: 0,
          transaction_count: 0,
          last_activity: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('wallet_address', walletAddress);

      if (error) {
        throw new Error(ErrorMessages.API_ERROR);
      }
    } catch (error) {
      this.errorHandler.handleError(error, {
        context: 'resetLeaderboardEntry',
        fallbackMessage: ErrorMessages.API_ERROR
      });
      throw error;
    }
  }

  /**
   * Get leaderboard statistics
   */
  async getLeaderboardStats(): Promise<{
    totalUsers: number;
    totalVolume: number;
    averageDeposit: number;
    topTier: string;
  }> {
    if (!this.isAvailable()) {
      throw new Error('Database not available');
    }

    try {
      const { data, error } = await supabase!
        .from('leaderboard')
        .select('total_usd_value')
        .order('total_usd_value', { ascending: false });

      if (error) {
        throw new Error(ErrorMessages.API_ERROR);
      }

      const users = data || [];
      const totalUsers = users.length;
      const totalVolume = users.reduce((sum, user) => sum + user.total_usd_value, 0);
      const averageDeposit = totalUsers > 0 ? totalVolume / totalUsers : 0;
      
      // Get top tier (highest value user)
      const topUser = users[0];
      let topTier = 'common';
      if (topUser) {
        topTier = getTierByUsd(topUser.total_usd_value);
      }

      return {
        totalUsers,
        totalVolume,
        averageDeposit,
        topTier
      };
    } catch (error) {
      this.errorHandler.handleError(error, {
        context: 'getLeaderboardStats',
        fallbackMessage: ErrorMessages.API_ERROR
      });
      throw error;
    }
  }
}

export const databaseService = DatabaseService.getInstance();