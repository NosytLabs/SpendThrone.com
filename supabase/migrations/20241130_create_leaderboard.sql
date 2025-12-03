-- Supabase SQL Migration for SpendThrone Leaderboard
-- This script creates the leaderboard table and sets up RLS policies

-- Create the leaderboard table
CREATE TABLE IF NOT EXISTS public.leaderboard (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    wallet_address VARCHAR(64) NOT NULL UNIQUE,
    display_name VARCHAR(100),
    total_usd_value DECIMAL(12, 2) NOT NULL DEFAULT 0,
    transaction_count INTEGER NOT NULL DEFAULT 0,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    message TEXT,
    link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leaderboard_total_usd_value ON public.leaderboard(total_usd_value DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_wallet_address ON public.leaderboard(wallet_address);
CREATE INDEX IF NOT EXISTS idx_leaderboard_last_activity ON public.leaderboard(last_activity DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow anyone to read leaderboard data
CREATE POLICY "Anyone can view leaderboard" ON public.leaderboard
    FOR SELECT USING (true);

-- Allow authenticated users to update their own entry
CREATE POLICY "Users can update own leaderboard entry" ON public.leaderboard
    FOR UPDATE USING (
        auth.uid()::text = wallet_address OR
        auth.jwt() ->> 'wallet' = wallet_address
    );

-- Allow authenticated users to insert new entries
CREATE POLICY "Authenticated users can insert leaderboard entries" ON public.leaderboard
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL OR
        auth.jwt() ->> 'wallet' IS NOT NULL
    );

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_leaderboard_updated_at
    BEFORE UPDATE ON public.leaderboard
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create a function to safely increment transaction count and USD value
CREATE OR REPLACE FUNCTION increment_leaderboard_stats(
    p_wallet_address VARCHAR(64),
    p_usd_value DECIMAL(12, 2),
    p_display_name VARCHAR(100) DEFAULT NULL,
    p_message TEXT DEFAULT NULL,
    p_link TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.leaderboard (
        wallet_address,
        display_name,
        total_usd_value,
        transaction_count,
        last_activity,
        message,
        link
    ) VALUES (
        p_wallet_address,
        p_display_name,
        p_usd_value,
        1,
        NOW(),
        p_message,
        p_link
    )
    ON CONFLICT (wallet_address) DO UPDATE SET
        total_usd_value = leaderboard.total_usd_value + p_usd_value,
        transaction_count = leaderboard.transaction_count + 1,
        last_activity = NOW(),
        display_name = COALESCE(p_display_name, leaderboard.display_name),
        message = COALESCE(p_message, leaderboard.message),
        link = COALESCE(p_link, leaderboard.link),
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT SELECT ON public.leaderboard TO anon;
GRANT SELECT ON public.leaderboard TO authenticated;
GRANT INSERT ON public.leaderboard TO authenticated;
GRANT UPDATE ON public.leaderboard TO authenticated;
