-- Users table to track referrals and join date
CREATE TABLE users (
  wallet_address TEXT PRIMARY KEY,
  referrer_id TEXT REFERENCES users(wallet_address),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast referral lookups
CREATE INDEX idx_users_referrer ON users(referrer_id);

-- Transactions table to track volume for Divine Favor
CREATE TABLE transactions (
  signature TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(wallet_address),
  amount_sol DECIMAL NOT NULL,
  transaction_type TEXT NOT NULL, -- 'tribute', 'status_purchase', etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for volume aggregation
CREATE INDEX idx_transactions_user ON transactions(user_id);

-- View to calculate Divine Favor (Points)
-- Formula: (Direct Referrals * 100) + (Referral Volume * 1000)
CREATE OR REPLACE VIEW divine_favor_stats AS
SELECT 
  u.wallet_address,
  COUNT(r.wallet_address) as referral_count,
  COALESCE(SUM(t.amount_sol), 0) as total_referral_volume,
  (COUNT(r.wallet_address) * 100) + (COALESCE(SUM(t.amount_sol), 0) * 1000) as divine_favor
FROM users u
LEFT JOIN users r ON u.wallet_address = r.referrer_id
LEFT JOIN transactions t ON r.wallet_address = t.user_id
GROUP BY u.wallet_address;
