-- Enhance leaderboard table to support custom profile data
ALTER TABLE public.leaderboard
ADD COLUMN IF NOT EXISTS custom_links JSONB DEFAULT '[]'::JSONB,
ADD COLUMN IF NOT EXISTS custom_sections JSONB DEFAULT '[]'::JSONB;

-- Update the increment_leaderboard_stats function (if it exists) or create a new update function
-- Since we can't easily modify the existing function signature without dropping it, 
-- we'll create a dedicated function for profile updates which is cleaner anyway.

CREATE OR REPLACE FUNCTION update_user_profile(
    p_wallet_address VARCHAR(64),
    p_display_name VARCHAR(100),
    p_message TEXT,
    p_link TEXT,
    p_custom_links JSONB,
    p_custom_sections JSONB
)
RETURNS VOID AS $$
BEGIN
    UPDATE public.leaderboard
    SET 
        display_name = p_display_name,
        message = p_message,
        link = p_link,
        custom_links = p_custom_links,
        custom_sections = p_custom_sections,
        updated_at = NOW()
    WHERE wallet_address = p_wallet_address;
    
    -- If no row exists (shouldn't happen for profile edit, but safety first), do nothing
    -- The user must have deposited to have a row, or we insert a placeholder?
    -- For now, we assume the row exists. If not, the frontend should handle "create profile" flow 
    -- by ensuring a row exists (e.g. via a 0-value deposit or a specific register call).
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION update_user_profile TO authenticated;
