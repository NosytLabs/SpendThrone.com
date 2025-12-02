# SpendThrone Database Setup Guide

## Overview
SpendThrone now supports a real database-backed leaderboard using Supabase. This guide will help you set up the database and configure the environment.

## Prerequisites
- Supabase account (https://supabase.com)
- Basic understanding of PostgreSQL
- Access to your project's environment variables

## Step 1: Create Supabase Project

1. Go to https://supabase.com and create a free account
2. Create a new project
3. Note down your project URL and anon key (found in Settings > API)

## Step 2: Configure Environment Variables

Add these to your `.env` file:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace:
- `your_supabase_project_url` with your actual Supabase project URL (format: `https://[project-id].supabase.co`)
- `your_supabase_anon_key` with your actual anon key

## Step 3: Set Up Database Schema

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase/migrations/20241130_create_leaderboard.sql`
4. Run the SQL script

This will create:
- `leaderboard` table with proper indexes
- Row Level Security (RLS) policies
- Helper functions for updating entries

## Step 4: Test the Setup

1. Start your development server: `npm run dev`
2. Navigate to the leaderboard page
3. Check the browser console - you should see either:
   - "Using real leaderboard data from database" (success)
   - "Supabase not configured. Using mock data." (needs configuration)

## Database Schema

### leaderboard table
```sql
CREATE TABLE leaderboard (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
```

## API Usage

### Getting Leaderboard Data
```typescript
import { getLeaderboardFromTreasury } from '@/core/services/leaderboardService';

const leaderboard = await getLeaderboardFromTreasury(50); // Get top 50
```

### Updating Leaderboard Entry
```typescript
import { updateLeaderboardEntry } from '@/core/services/leaderboardService';

await updateLeaderboardEntry(
  'wallet_address_here',
  100.50, // USD value to add
  {
    displayName: 'KingSolana',
    message: 'Long live the King! 👑',
    link: 'https://twitter.com/solana',
    incrementTransactions: true
  }
);
```

### Using Database Service Directly
```typescript
import { databaseService } from '@/core/services/databaseService';

// Get leaderboard with stats
const leaderboard = await databaseService.getLeaderboard(50);
const stats = await databaseService.getLeaderboardStats();

// Update user entry
await databaseService.upsertLeaderboardEntry(walletAddress, usdValue, options);
```

## Security Features

### Row Level Security (RLS)
- Anyone can read leaderboard data
- Only authenticated users can insert/update entries
- Users can only update their own entries

### Rate Limiting
The service includes built-in rate limiting to prevent abuse:
- Maximum 100 requests per minute per IP
- Maximum 10 updates per wallet per minute

## Fallback Behavior

If Supabase is not configured or unavailable:
1. The app automatically falls back to mock data
2. All leaderboard functionality continues to work
3. Console warnings indicate the fallback mode
4. No user-facing errors occur

## Monitoring

Check the browser console for:
- Database connection status
- Query performance metrics
- Error messages and debugging info
- Fallback mode notifications

## Troubleshooting

### "Supabase not configured" warning
- Check that environment variables are set correctly
- Ensure the variables are prefixed with `VITE_` for Vite
- Restart your development server after adding env vars

### "Error fetching leaderboard from database"
- Check Supabase project status
- Verify network connectivity
- Check RLS policies in Supabase dashboard
- Review console for detailed error messages

### Data not updating
- Check wallet authentication status
- Verify RLS policies allow updates
- Check for constraint violations (unique wallet_address)
- Review transaction amounts and limits

## Performance Optimization

### Indexes
The following indexes are created automatically:
- `total_usd_value` (DESC) for leaderboard ordering
- `wallet_address` for user lookups
- `last_activity` for recent activity queries

### Caching
- Client-side caching is implemented in the hooks
- Database queries are optimized for pagination
- Consider implementing Redis caching for high-traffic scenarios

## Next Steps

1. Set up real-time subscriptions for live updates
2. Add user authentication integration
3. Implement transaction history tracking
4. Add admin dashboard for monitoring
5. Set up automated backups

## Support

For issues related to:
- **Database setup**: Check Supabase documentation
- **Code implementation**: Review error logs and console output
- **Performance**: Monitor query times and optimize indexes
- **Security**: Review RLS policies and authentication