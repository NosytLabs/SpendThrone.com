
import { useMemo, useEffect } from 'react';
import { supabase } from '@/core/database/supabase';
import { databaseService } from '@/core/services/databaseService';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { APP_CONSTANTS } from '@/core/constants/config';

export const useLeaderboard = () => {
  const { publicKey } = useWallet();
  const queryClient = useQueryClient();
  
  const { data: leaderboard = [], isLoading, error, refetch } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => databaseService.getLeaderboard(APP_CONSTANTS.LEADERBOARD.FETCH_LIMIT),
    staleTime: 1000 * 60, // 1 minute
  });

  // Calculate user rank
  const userRank = useMemo(() => {
    if (publicKey && leaderboard.length > 0) {
      const userEntry = leaderboard.find(entry => entry.walletAddress === publicKey.toString());
      return userEntry?.rank || null;
    }
    return null;
  }, [publicKey, leaderboard]);

  // Subscribe to realtime leaderboard changes when Supabase is available
  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel(APP_CONSTANTS.LEADERBOARD.REALTIME_CHANNEL)
      .on(
        'postgres_changes',
        { event: '*', schema: APP_CONSTANTS.LEADERBOARD.SCHEMA, table: APP_CONSTANTS.LEADERBOARD.TABLE },
        () => {
          // Invalidate query to trigger refetch
          queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
        }
      )
      .subscribe();

    return () => {
      try {
        supabase?.removeChannel(channel);
      } catch {
        // ignore
      }
    };
  }, [queryClient]);

  return { 
    leaderboard, 
    isLoading, 
    error: error ? (error as Error).message : null, 
    refetch, 
    userRank 
  };
};
