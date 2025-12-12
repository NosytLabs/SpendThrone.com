import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { debugLog } from '@/shared/utils/logger';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.REACT_APP_SUPABASE_ANON_KEY;

const isValidHttpUrl = (value: string | undefined) => {
  if (!value) return false;
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
};

let client: SupabaseClient<Database> | null = null;
if (isValidHttpUrl(supabaseUrl) && !!supabaseAnonKey) {
  try {
    client = createClient<Database>(supabaseUrl!, supabaseAnonKey!);
  } catch (e) {
    client = null;
    debugLog('Supabase initialization failed, falling back to mock data.', 'warn');
  }
} else {
  debugLog('Supabase configuration invalid or missing. Using mock data for leaderboard.', 'warn');
}

export const supabase = client;

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          wallet_address: string;
          created_at: string;
          last_active: string;
        };
        Insert: {
          wallet_address: string;
          created_at?: string;
          last_active?: string;
        };
        Update: {
          wallet_address?: string;
          created_at?: string;
          last_active?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          signature: string;
          wallet_address: string;
          amount_token: number;
          token_mint: string;
          usd_value: number;
          message: string | null;
          timestamp: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          signature: string;
          wallet_address: string;
          amount_token: number;
          token_mint: string;
          usd_value: number;
          message?: string | null;
          timestamp: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          signature?: string;
          wallet_address?: string;
          amount_token?: number;
          token_mint?: string;
          usd_value?: number;
          message?: string | null;
          timestamp?: string;
          created_at?: string;
        };
      };
      referrals: {
        Row: {
          id: string;
          referrer_address: string;
          referee_address: string;
          amount_usd: number;
          transaction_signature: string;
          timestamp: string;
        };
        Insert: {
          id?: string;
          referrer_address: string;
          referee_address: string;
          amount_usd: number;
          transaction_signature: string;
          timestamp: string;
        };
        Update: {
          id?: string;
          referrer_address?: string;
          referee_address?: string;
          amount_usd?: number;
          transaction_signature?: string;
          timestamp?: string;
        };
      };
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
          custom_links: Json | null;
          custom_sections: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          wallet_address: string;
          display_name?: string | null;
          total_usd_value?: number;
          transaction_count?: number;
          last_activity?: string;
          message?: string | null;
          link?: string | null;
          custom_links?: Json | null;
          custom_sections?: Json | null;
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
          custom_links?: Json | null;
          custom_sections?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never
    };
    Functions: {
      [_ in never]: never
    };
    Enums: {
      [_ in never]: never
    };
    CompositeTypes: {
      [_ in never]: never
    };
  };
}

export interface LeaderboardRecord {
  id: string;
  wallet_address: string;
  display_name: string | null;
  total_usd_value: number;
  transaction_count: number;
  last_activity: string;
  message: string | null;
  link: string | null;
  custom_links?: { label: string; url: string }[];
  custom_sections?: { title: string; content: string }[];
  created_at: string;
  updated_at: string;
}
