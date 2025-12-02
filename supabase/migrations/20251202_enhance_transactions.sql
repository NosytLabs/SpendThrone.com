-- Enhance transactions table to support multi-token deposits and messages

-- Add new columns
ALTER TABLE public.transactions
ADD COLUMN IF NOT EXISTS token_symbol TEXT,
ADD COLUMN IF NOT EXISTS usd_value DECIMAL(12, 2),
ADD COLUMN IF NOT EXISTS message TEXT,
ADD COLUMN IF NOT EXISTS amount DECIMAL;

-- Make amount_sol nullable if we want to support non-SOL transactions without filling it
-- ALTER TABLE public.transactions ALTER COLUMN amount_sol DROP NOT NULL;
-- For now, we can just fill amount_sol with 0 or the equivalent SOL value if we want to keep it valid.
