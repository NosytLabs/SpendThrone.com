# Database-Based Leaderboard Implementation Plan

## 🎯 OBJECTIVE
Transform the current mock-data leaderboard into a real-time, database-driven system that tracks actual user deposits and activities from the Solana chain.

## 📊 CURRENT STATE ANALYSIS

### What's Working
- ✅ Database schema is complete with leaderboard table
- ✅ Service layer supports real data fetching
- ✅ UI components are production-ready
- ✅ RPC integration points exist (currently disabled)
- ✅ Error handling and logging implemented

### What's Missing
- ❌ Supabase client configuration
- ❌ Real deposit tracking from chain
- ❌ User authentication system
- ❌ Transaction history integration

## 🔧 IMPLEMENTATION STEPS

### Phase 1: Environment Setup (15 minutes)

#### 1.1 Configure Supabase Environment Variables
```bash
# .env.local
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### 1.2 Verify Database Connection
```typescript
// src/core/services/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey ? 
  createClient(supabaseUrl, supabaseAnonKey) : null;
```

### Phase 2: Enable Real Data (30 minutes)

#### 2.1 Modify Leaderboard Service
```typescript
// src/core/services/leaderboardService.ts
export async function getLeaderboardData(limit = 50): Promise<LeaderboardEntry[]> {
  // Remove the mock fallback - always try real data first
  const supabase = getSupabaseClient();
  
  if (!supabase) {
    debugLog('Supabase not configured', 'error');
    throw new Error('Database connection not available');
  }

  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('total_usd_value', { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    return data.map(transformDatabaseRecord);
  } catch (error) {
    debugLog('Error fetching leaderboard:', error);
    throw error; // Don't fallback to mock data
  }
}
```

#### 2.2 Update Hook Error Handling
```typescript
// src/hooks/useLeaderboard.ts
export const useLeaderboard = () => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: getLeaderboardData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    onError: (error) => {
      toast.error('Failed to load leaderboard');
      debugLog('Leaderboard fetch error:', error);
    }
  });

  return {
    leaderboard: data || [],
    isLoading,
    error,
    refetch
  };
};
```

### Phase 3: Real Deposit Tracking (45 minutes)

#### 3.1 Create Deposit Tracking Function
```typescript
// src/core/services/depositService.ts
export async function trackDeposit(
  walletAddress: string,
  amount: number,
  token: string,
  txHash: string,
  usdValue: number
) {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  try {
    // Record the transaction
    await supabase.from('transactions').insert({
      wallet_address: walletAddress,
      amount,
      token,
      tx_hash: txHash,
      usd_value: usdValue,
      type: 'deposit'
    });

    // Update leaderboard entry
    await updateLeaderboardEntry(walletAddress, usdValue, {
      incrementTransactions: true
    });

    debugLog('Deposit tracked successfully', 'info');
  } catch (error) {
    debugLog('Error tracking deposit:', error);
  }
}
```

#### 3.2 Integrate with Payment Processing
```typescript
// src/features/payment/usePayment.ts
const processPayment = async (amount: number, token: string) => {
  try {
    // ... existing payment logic ...
    
    const txHash = await sendTransaction(transaction, connection);
    
    // Track the deposit in database
    await trackDeposit(
      publicKey.toString(),
      amount,
      token,
      txHash,
      usdValue
    );
    
    toast.success('Payment successful! You\'ve been added to the leaderboard.');
    
  } catch (error) {
    toast.error('Payment failed');
    throw error;
  }
};
```

### Phase 4: User Authentication (60 minutes)

#### 4.1 Implement Wallet-Based Auth
```typescript
// src/core/services/authService.ts
export async function authenticateWallet(walletAddress: string) {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();

    if (existingUser) {
      return existingUser;
    }

    // Create new user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        wallet_address: walletAddress,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    
    return newUser;
  } catch (error) {
    debugLog('Authentication error:', error);
    return null;
  }
}
```

#### 4.2 Add Auth Context
```typescript
// src/core/contexts/AuthContext.tsx
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { publicKey } = useWallet();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (publicKey) {
      authenticateWallet(publicKey.toString()).then(setUser);
    } else {
      setUser(null);
    }
  }, [publicKey]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Phase 5: Enhanced Features (45 minutes)

#### 5.1 Real-time Updates with Subscriptions
```typescript
// src/hooks/useLeaderboardSubscription.ts
export const useLeaderboardSubscription = () => {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const subscription = supabase
      .channel('leaderboard_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'leaderboard' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);
};
```

#### 5.2 User Rank Tracking
```typescript
// src/hooks/useUserRank.ts
export const useUserRank = (walletAddress: string) => {
  return useQuery({
    queryKey: ['userRank', walletAddress],
    queryFn: async () => {
      const supabase = getSupabaseClient();
      if (!supabase) return null;

      const { data, error } = await supabase
        .rpc('get_user_rank', { wallet_address: walletAddress });

      if (error) throw error;
      return data;
    },
    enabled: !!walletAddress,
  });
};
```

## 📊 DATABASE FUNCTIONS

### Create Rank Calculation Function
```sql
-- Create function to get user rank
CREATE OR REPLACE FUNCTION get_user_rank(wallet_address TEXT)
RETURNS TABLE(rank INTEGER, total_usd_value DECIMAL)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    subquery.rank,
    subquery.total_usd_value
  FROM (
    SELECT 
      wallet_address,
      total_usd_value,
      RANK() OVER (ORDER BY total_usd_value DESC) as rank
    FROM leaderboard
  ) subquery
  WHERE subquery.wallet_address = get_user_rank.wallet_address;
END;
$$;
```

### Create Deposit Tracking Trigger
```sql
-- Create trigger to automatically update leaderboard on new deposits
CREATE OR REPLACE FUNCTION update_leaderboard_on_deposit()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update or create leaderboard entry
  INSERT INTO leaderboard (wallet_address, total_usd_value, transaction_count)
  VALUES (NEW.wallet_address, NEW.usd_value, 1)
  ON CONFLICT (wallet_address) 
  DO UPDATE SET
    total_usd_value = leaderboard.total_usd_value + NEW.usd_value,
    transaction_count = leaderboard.transaction_count + 1,
    last_activity = NOW(),
    updated_at = NOW();
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_update_leaderboard
  AFTER INSERT ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_leaderboard_on_deposit();
```

## 🎨 UI/UX ENHANCEMENTS

### Real-time Position Changes
```typescript
// src/features/leaderboard/LeaderboardRow.tsx
const LeaderboardRow: React.FC<{ entry: LeaderboardEntry; previousRank?: number }> = ({ 
  entry, 
  previousRank 
}) => {
  const rankChange = previousRank ? previousRank - entry.rank : 0;
  
  return (
    <tr className={cn(
      "transition-all duration-500",
      rankChange > 0 && "animate-rank-up",
      rankChange < 0 && "animate-rank-down"
    )}>
      <td className="rank-cell">
        <div className="flex items-center gap-2">
          <span className="rank-number">#{entry.rank}</span>
          {rankChange !== 0 && (
            <RankChangeIndicator change={rankChange} />
          )}
        </div>
      </td>
      {/* ... rest of row */}
    </tr>
  );
};
```

### Achievement Notifications
```typescript
// src/features/achievements/AchievementNotification.tsx
const AchievementNotification: React.FC<{ achievement: Achievement }> = ({ achievement }) => {
  return (
    <div className="achievement-toast">
      <RoyalIcon name="crown" className="achievement-icon" />
      <div className="achievement-content">
        <h4>New Achievement!</h4>
        <p>{achievement.title}</p>
      </div>
    </div>
  );
};
```

## 🧪 TESTING STRATEGY

### Unit Tests
```typescript
// __tests__/leaderboardService.test.ts
describe('LeaderboardService', () => {
  it('should fetch real leaderboard data', async () => {
    mockSupabaseClient
      .from('leaderboard')
      .select()
      .mockResolvedValue({
        data: mockLeaderboardData,
        error: null
      });

    const result = await getLeaderboardData(10);
    expect(result).toHaveLength(10);
    expect(result[0]).toHaveProperty('rank');
    expect(result[0]).toHaveProperty('walletAddress');
  });

  it('should handle database errors gracefully', async () => {
    mockSupabaseClient
      .from('leaderboard')
      .select()
      .mockRejectedValue(new Error('Database error'));

    await expect(getLeaderboardData()).rejects.toThrow('Database error');
  });
});
```

### Integration Tests
```typescript
// __tests__/depositTracking.test.ts
describe('Deposit Tracking', () => {
  it('should track deposits and update leaderboard', async () => {
    const walletAddress = 'test-wallet-123';
    const depositAmount = 100;
    const usdValue = 50;

    await trackDeposit(walletAddress, depositAmount, 'USDC', 'tx-123', usdValue);

    // Verify transaction was recorded
    const transaction = await getTransaction('tx-123');
    expect(transaction).toBeDefined();
    expect(transaction.usd_value).toBe(usdValue);

    // Verify leaderboard was updated
    const leaderboardEntry = await getLeaderboardEntry(walletAddress);
    expect(leaderboardEntry.total_usd_value).toBeGreaterThan(0);
  });
});
```

## 📈 PERFORMANCE OPTIMIZATION

### Caching Strategy
```typescript
// Implement React Query caching with proper stale times
const leaderboardQuery = useQuery({
  queryKey: ['leaderboard', filter, limit],
  queryFn: () => getLeaderboardData(filter, limit),
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
  refetchOnWindowFocus: false,
  refetchOnMount: false,
});
```

### Database Indexing
```sql
-- Optimize leaderboard queries
CREATE INDEX idx_leaderboard_total_usd_value ON leaderboard(total_usd_value DESC);
CREATE INDEX idx_leaderboard_wallet_address ON leaderboard(wallet_address);
CREATE INDEX idx_leaderboard_last_activity ON leaderboard(last_activity DESC);

-- Optimize transaction queries
CREATE INDEX idx_transactions_wallet_address ON transactions(wallet_address);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
```

## 🚀 DEPLOYMENT CHECKLIST

### Pre-deployment
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Database functions created
- [ ] Database indexes created
- [ ] Supabase client tested

### Post-deployment
- [ ] Leaderboard data fetching verified
- [ ] Deposit tracking tested
- [ ] Real-time updates working
- [ ] User authentication tested
- [ ] Performance monitoring enabled

## 📊 SUCCESS METRICS

### Technical Metrics
- **Response Time:** < 500ms for leaderboard queries
- **Uptime:** 99.9% availability
- **Error Rate:** < 0.1% failed requests
- **Data Freshness:** Real-time updates within 5 seconds

### User Experience Metrics
- **Leaderboard Load Time:** < 2 seconds
- **Deposit Recognition:** < 10 seconds
- **Rank Updates:** Real-time notifications
- **User Satisfaction:** > 90% positive feedback

## 🎯 CONCLUSION

This implementation plan provides a complete roadmap for transforming the mock leaderboard into a robust, real-time system. The foundation is solid, and with proper execution, users will experience a seamless, engaging leaderboard that accurately reflects their on-chain activities.

**Total Implementation Time:** ~3 hours
**Risk Level:** Low (incremental deployment possible)
**Impact:** High (major user experience improvement)