import { supabase } from '@/core/database/supabase';
import { debugLog } from '@/shared/utils/logger';
import { SupabaseClient } from '@supabase/supabase-js';

export async function authenticateWallet(walletAddress: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = supabase as SupabaseClient<any> | null;
  if (!client) return null;

  try {
    // Check if user exists
    // Check if user exists
    const { data } = await client
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();
    
    const existingUser = data;

    if (existingUser) {
      return existingUser;
    }

    // Create new user
    const response = await client
      .from('users')
      .insert({
        wallet_address: walletAddress,
        created_at: new Date().toISOString(),
        last_active: new Date().toISOString()
      })
      .select()
      .single();
    
    const newUser = response.data;
    const error = response.error;

    if (error) throw error;
    
    return newUser;
  } catch (error) {
    debugLog('Authentication error:', error);
    // Try to return existing user if insert failed (race condition)
    try {
        const { data: retryUser } = await client
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
