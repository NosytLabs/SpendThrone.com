import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client helper
// Uses process.env which is available in Vercel serverless functions

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY; 
// Note: For webhooks, we prefer Service Role Key to bypass RLS if needed, but Anon Key works if RLS allows inserts.
// Since our RLS allows inserts from authenticated users, and we might not have a user session here,
// we might need the Service Role Key to write as admin, or we assume the webhook is trusted.
// Ideally, use SERVICE_ROLE_KEY for backend operations.

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Supabase server configuration missing');
}

export const supabaseAdmin = (supabaseUrl && supabaseServiceKey)
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;
