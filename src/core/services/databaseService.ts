import { supabase } from '@/core/database/supabase';
import { LeaderboardRecord } from '@/core/database/supabase';
import { createErrorHandler, ErrorMessages } from '@/shared/utils/errorHandler';
import { debugLog } from '@/shared/utils/logger';
import { LeaderboardEntry } from '@/shared/utils/types';
import { getTierByUsd } from '@/shared/utils/tierSystem';

// Mock data generator removed as per implementation plan


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
      debugLog('Database not available', 'error');
      throw new Error('Database connection not available');
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
      
      if (!data) {
         return [];
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
      throw error;
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