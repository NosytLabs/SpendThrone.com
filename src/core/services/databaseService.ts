import { supabase } from '@/core/database/supabase';
import { LeaderboardRecord } from '@/core/database/supabase';
import { createErrorHandler, ErrorMessages } from '@/shared/utils/errorHandler';
import { debugLog } from '@/shared/utils/logger';
import { LeaderboardEntry, Transaction } from '@/shared/utils/types';
import { getTierByUsd } from '@/shared/utils/tierSystem';
import { generateMockLeaderboard } from '@/core/data/mockLeaderboardData';
import { swapService } from '@/core/services/swapService';
import { SupabaseClient } from '@supabase/supabase-js';
import { Buffer } from 'buffer';
import { PublicKey } from '@solana/web3.js';


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
  
  // Explicitly typed client accessor
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private get client(): SupabaseClient<any> | null {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return supabase as any;
  }

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
    return this.client !== null;
  }

  /**
   * Get leaderboard entries ordered by USD value
   */
  async getLeaderboard(limit = 50): Promise<LeaderboardEntry[]> {
    if (!this.isAvailable()) {
      debugLog('Database not available. Using mock data with local overrides.', 'warn');
      let mockData = generateMockLeaderboard(limit);
      
      // Merge local deposits into mock data to simulate functionality
      try {
        const localDeposits = swapService.getLocalDeposits();
        if (localDeposits.length > 0) {
          // Group by wallet
          const userDeposits = localDeposits.reduce((acc, deposit) => {
            const addr = deposit.walletAddress;
            if (!acc[addr]) {
              acc[addr] = { totalUsd: 0, count: 0, lastActivity: 0 };
            }
            acc[addr].totalUsd += deposit.usdValue;
            acc[addr].count += 1;
            acc[addr].lastActivity = Math.max(acc[addr].lastActivity, deposit.timestamp);
            return acc;
          }, {} as Record<string, { totalUsd: number; count: number; lastActivity: number }>);

          // Add/Update users in leaderboard
          Object.entries(userDeposits).forEach(([address, stats]) => {
            const existingIndex = mockData.findIndex(m => m.walletAddress === address);
            const entry: LeaderboardEntry = {
              rank: 0, // Recalculated later
              walletAddress: address,
              displayName: 'You (Local)',
              totalUsdValue: stats.totalUsd,
              tier: getTierByUsd(stats.totalUsd),
              transactionCount: stats.count,
              timeAgo: new Date(stats.lastActivity).toISOString(),
              message: 'Local Simulation',
              customSections: []
            };

            if (existingIndex >= 0) {
              // Update existing mock entry if it matched (unlikely for random mocks but possible)
              mockData[existingIndex] = { ...mockData[existingIndex], ...entry, displayName: mockData[existingIndex].displayName };
            } else {
              // Add new entry
              mockData.push(entry);
            }
          });

          // Re-sort and slice
          mockData = mockData
            .sort((a, b) => b.totalUsdValue - a.totalUsdValue)
            .map((entry, index) => ({ ...entry, rank: index + 1 }))
            .slice(0, limit);
        }
      } catch (e) {
        debugLog('Failed to merge local deposits:', e);
      }

      debugLog(`Returning ${mockData.length} leaderboard entries (Mixed Mode)`, 'info');
      return mockData;
    }

    try {

      const { data, error } = await this.client!
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

      return data.map((record, index: number) => ({
        rank: index + 1,
        walletAddress: record.wallet_address,
        displayName: record.display_name || undefined,
        totalUsdValue: record.total_usd_value,
        tier: getTierByUsd(record.total_usd_value),
        transactionCount: record.transaction_count,
        timeAgo: record.last_activity || record.created_at,
        message: record.message || undefined,
        link: record.link || undefined,
        customLinks: record.custom_links || [],
        customSections: record.custom_sections || []
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
   * Securely update user profile with signature verification
   */
  async updateUserProfileSecure(
    walletAddress: string,
    signature: Uint8Array,
    timestamp: number,
    data: { 
      displayName?: string; 
      message?: string; 
      link?: string;
      customLinks?: { label: string; url: string }[];
      customSections?: { title: string; content: string }[];
    }
  ): Promise<void> {
    if (!this.isAvailable()) {
      debugLog('Database not available. Mocking secure profile update.', 'warn');
      return;
    }

    try {
      // Convert signature to hex string for easier processing in Postgres
      // We use Buffer (polyfilled) to convert Uint8Array to Hex
      const signatureHex = Buffer.from(signature).toString('hex');
      
      // Convert Wallet Address (Base58) to Public Key Hex
      const publicKeyHex = new PublicKey(walletAddress).toBuffer().toString('hex');

      const { error } = await this.client!.rpc('update_profile_secure', {
        p_wallet_address: walletAddress,
        p_timestamp: timestamp,
        p_signature: signatureHex,
        p_public_key_hex: publicKeyHex,
        p_display_name: data.displayName,
        p_message: data.message,
        p_link: data.link
        // Note: customLinks and customSections support can be added to RPC later
      });

      if (error) {
        // Fallback to insecure update if RPC is missing (backward compatibility during migration)
        if (error.code === 'PGRST202') { // Function not found
             debugLog('Secure RPC not found, falling back to standard update', 'warn');
             await this.updateUserProfile(walletAddress, data);
             return;
        }
        throw error;
      }
      
    } catch (error) {
      this.errorHandler.handleError(error, {
        context: 'updateUserProfileSecure',
        fallbackMessage: 'Failed to update profile securely'
      });
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(
    walletAddress: string, 
    data: { 
      displayName?: string; 
      message?: string; 
      link?: string;
      customLinks?: { label: string; url: string }[];
      customSections?: { title: string; content: string }[];
    }
  ): Promise<void> {
    if (!this.isAvailable()) {
      debugLog('Database not available. Mocking profile update.', 'warn');
      return;
    }

    try {
      // First check if user exists (optional, upsert handles creation)
      // const existing = await this.getUserLeaderboardEntry(walletAddress);
      
      // If user doesn't exist, we need to insert them with 0 stats first
      // OR we can use an upsert. 
      // The update_user_profile RPC might handle updates, but standard upsert is safer if we don't know state.
      
      const updatePayload: Partial<LeaderboardRecord> = {
        wallet_address: walletAddress,
        updated_at: new Date().toISOString()
      };

      if (data.displayName !== undefined) updatePayload.display_name = data.displayName;
      if (data.message !== undefined) updatePayload.message = data.message;
      if (data.link !== undefined) updatePayload.link = data.link;
      if (data.customLinks !== undefined) updatePayload.custom_links = data.customLinks;
      if (data.customSections !== undefined) updatePayload.custom_sections = data.customSections;

      const { error } = await this.client!
        .from('leaderboard')
        .upsert(updatePayload, { onConflict: 'wallet_address' });

      if (error) throw error;
      
    } catch (error) {
      this.errorHandler.handleError(error, {
        context: 'updateUserProfile',
        fallbackMessage: 'Failed to update profile'
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

      const { data, error } = await this.client!
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
   * Get a user's global rank
   */
  async getRankForUser(walletAddress: string): Promise<number> {
    if (!this.isAvailable()) {
      return 0;
    }

    try {
      const userEntry = await this.getUserLeaderboardEntry(walletAddress);
      if (!userEntry) return 0;

      const { count, error } = await this.client!
        .from('leaderboard')
        .select('*', { count: 'exact', head: true })
        .gt('total_usd_value', userEntry.total_usd_value);

      if (error) {
        throw new Error(ErrorMessages.API_ERROR);
      }

      return (count || 0) + 1;
    } catch (error) {
      this.errorHandler.handleError(error, {
        context: 'getRankForUser',
        fallbackMessage: ErrorMessages.API_ERROR
      });
      return 0;
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
        // Only update message if it's explicitly provided and not empty
        if (options?.message) updates.message = options.message;
        if (options?.link) updates.link = options.link;
        if (options?.incrementTransactions) {
          updates.transaction_count = (existingEntry.transaction_count || 0) + 1;
        }

        const { error } = await this.client!
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

        const { error } = await this.client!
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
      const { error } = await this.client!
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
   * Get transactions for a user
   */
  async getTransactions(walletAddress: string, limit = 50): Promise<Transaction[]> {
    if (!this.isAvailable()) {
      return [];
    }

    try {

      const { data, error } = await this.client!
        .from('transactions')
        .select('*')
        .eq('wallet_address', walletAddress)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(error.message);
      }

      if (!data) return [];

      return data.map((tx: Record<string, unknown>, index: number) => ({
        id: index, // Frontend expects number ID, but UUID is string. We'll map to index or keep string if type allows
        amount: Number(tx.usd_value) || 0,
        currency: 'USD',
        timestamp: String(tx.timestamp || ''),
        type: 'tribute',
        rankChange: 0, // Calculated on frontend or separate query
        signature: typeof tx.signature === 'string' ? tx.signature : undefined
      }));
    } catch (error) {
      this.errorHandler.handleError(error, {
        context: 'getTransactions',
        fallbackMessage: ErrorMessages.API_ERROR
      });
      return [];
    }
  }

  /**
   * Get referral stats for a user
   */
  async getReferralStats(walletAddress: string): Promise<{ count: number; volume: number }> {
    if (!this.isAvailable()) {
      return { count: 0, volume: 0 };
    }

    try {

      const { data, error } = await this.client!
        .from('referrals')
        .select('amount_usd')
        .eq('referrer_address', walletAddress);

      if (error) {
        throw new Error(error.message);
      }

      if (!data || data.length === 0) {
        return { count: 0, volume: 0 };
      }

      const count = data.length;
      const volume = data.reduce((sum: number, ref: Record<string, unknown>) => sum + (ref.amount_usd as number || 0), 0);

      return { count, volume };
    } catch (error) {
      this.errorHandler.handleError(error, {
        context: 'getReferralStats',
        fallbackMessage: ErrorMessages.API_ERROR
      });
      return { count: 0, volume: 0 };
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

      const { data, error } = await this.client!
        .from('leaderboard')
        .select('total_usd_value')
        .order('total_usd_value', { ascending: false });

      if (error) {
        throw new Error(ErrorMessages.API_ERROR);
      }

      const users = data || [];
      const totalUsers = users.length;
      const totalVolume = users.reduce((sum: number, user) => sum + user.total_usd_value, 0);
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