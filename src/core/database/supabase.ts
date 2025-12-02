import { createClient } from '@supabase/supabase-js';
import { debugLog } from '@/shared/utils/logger';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  debugLog('Supabase configuration missing. Using mock data for leaderboard.', 'warn');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface Database {
  public: {
    Tables: {
      leaderboard: {
        Row: {
          id: string;
          wallet_address: string;
          display_name: string | null;
          total_usd_value: number;
          transaction_count: number;
          last_activity: string;
          message: string | null;
          link: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          wallet_address: string;
          display_name?: string | null;
          total_usd_value: number;
          transaction_count?: number;
          last_activity?: string;
          message?: string | null;
          link?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          wallet_address?: string;
          display_name?: string | null;
          total_usd_value?: number;
          transaction_count?: number;
          last_activity?: string;
          message?: string | null;
          link?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type LeaderboardRecord = Database['public']['Tables']['leaderboard']['Row'];