-- Optimization and Security Hardening Migration
-- Date: 2025-12-11

-- 1. Add missing indexes for performance
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_usd_value ON public.transactions(usd_value DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_amount_sol ON public.transactions(amount_sol DESC);

-- 2. Enable Row Level Security (RLS) on key tables
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 3. Define RLS Policies for Transactions

-- Public Read Access: Anyone can see transactions (needed for "Recent Activity" feeds)
CREATE POLICY "Public read access for transactions" ON public.transactions
    FOR SELECT USING (true);

-- Authenticated Insert: Users can only insert transactions linked to their own wallet
-- Note: In a real dApp, transactions should ideally be inserted by an Edge Function 
-- that verifies the signature on-chain before insertion to prevent spoofing.
-- For this client-side demo/MVP, we allow authenticated inserts but validation happens elsewhere.
CREATE POLICY "Users can insert own transactions" ON public.transactions
    FOR INSERT WITH CHECK (
        auth.uid()::text = user_id OR
        auth.jwt() ->> 'wallet' = user_id
    );

-- 4. Define RLS Policies for Users

-- Public Read Access
CREATE POLICY "Public read access for users" ON public.users
    FOR SELECT USING (true);

-- Authenticated Update: Users can only update their own profile data
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (
        auth.uid()::text = wallet_address OR
        auth.jwt() ->> 'wallet' = wallet_address
    );

-- Authenticated Insert: Users can create their own profile
CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (
        auth.uid()::text = wallet_address OR
        auth.jwt() ->> 'wallet' = wallet_address
    );
