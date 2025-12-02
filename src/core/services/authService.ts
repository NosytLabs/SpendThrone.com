import { supabase } from '@/core/database/supabase';
import { debugLog } from '@/shared/utils/logger';

export async function authenticateWallet(walletAddress: string) {
  if (!supabase) return null;

  try {
    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();

    if (existingUser) {
      return existingUser;
    }

    // Create new user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        wallet_address: walletAddress,
        created_at: new Date().toISOString(),
        last_active: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    
    return newUser;
  } catch (error) {
    debugLog('Authentication error:', error);
    // Try to return existing user if insert failed (race condition)
    try {
        const { data: retryUser } = await supabase
        .from('users')
        .select('*')
        .eq('wallet_address', walletAddress)
        .single();
        return retryUser;
    } catch (e) {
        return null;
    }
  }
}

// Helper to ensure user exists (idempotent)
export async function ensureUserExists(walletAddress: string) {
    return authenticateWallet(walletAddress);
}
