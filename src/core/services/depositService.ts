import { supabase } from '@/core/database/supabase';
import { DatabaseService } from '@/core/services/databaseService';
import { debugLog } from '@/shared/utils/logger';
import { ensureUserExists } from '@/core/services/authService';

export async function trackDeposit(
  walletAddress: string,
  amount: number,
  token: string,
  txHash: string,
  usdValue: number,
  message?: string,
  link?: string
) {
  // If supabase is not initialized (e.g. missing env vars), we can't track to DB.
  
  if (!supabase) {
    debugLog('Supabase not configured, skipping deposit tracking', 'warn');
    return;
  }

  try {
    // Ensure user exists to satisfy foreign key
    await ensureUserExists(walletAddress);

    // Record the transaction
    // Schema matches 'transactions' table in supabase/schema.sql + 20251202_enhance_transactions.sql
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from('transactions').insert({
      signature: txHash,
      user_id: walletAddress,
      amount_sol: token === 'SOL' ? amount : 0, // Required by schema (NOT NULL)
      transaction_type: 'deposit',
      token_symbol: token,
      usd_value: usdValue,
      amount: amount,
      message: message
    });

    if (error) {
      throw error;
    }

    // Update leaderboard entry
    const databaseService = DatabaseService.getInstance();
    await databaseService.upsertLeaderboardEntry(walletAddress, usdValue, {
      incrementTransactions: true,
      message: message, // Update message only if provided?
      link: link
    });

    debugLog('Deposit tracked successfully', 'info');
  } catch (error) {
    debugLog('Error tracking deposit:', error);
    // We don't rethrow here to avoid failing the UI payment flow if tracking fails
  }
}

export function getMockHistory() {
  return [
    { id: 'tx1', amount: 50, currency: 'SOL', timestamp: new Date(Date.now() - 86400000).toISOString(), type: 'tribute', rankChange: 2 },
    { id: 'tx2', amount: 25, currency: 'SOL', timestamp: new Date(Date.now() - 172800000).toISOString(), type: 'tribute', rankChange: 0 },
  ];
}

export async function getDepositHistory(walletAddress: string): Promise<unknown[]> {
  // Fallback deposit history with sample data
  debugLog(`Fetching deposit history for ${walletAddress}`);
  return Promise.resolve(getMockHistory());
}

