import { useState, useEffect, useCallback } from 'react';
import { startIntervalWhenVisible } from '@/shared/utils/visibility';
import { useWallet } from '@solana/wallet-adapter-react';
import { priceService, PriceData } from '@/core/services/priceService';
import { statsService } from '@/core/services/statsService';
import { debugLog } from '@/shared/utils/logger';
import { createErrorHandler, ErrorMessages } from '@/shared/utils/errorHandler';

export interface UserStats {
  totalBalance: number;
  totalEarned: number;
  activeStakes: number;
  tier: string | null;
  rank: number | null;
}

export interface HomeStats {
  totalValue: number;
  totalUsers: number;
  totalTransactions: number;
  averageDeposit: number;
  solPrice: PriceData | null;
}

interface HomeData {
  userStats: UserStats | null;
  homeStats: HomeStats;
  isLoading: boolean;
  error: string | null;
  fetchHomeData: () => Promise<void>;
}

// Initial state for home data
const initialHomeStats: HomeStats = {
  totalValue: 0,
  totalUsers: 0,
  totalTransactions: 0,
  averageDeposit: 0,
  solPrice: null,
};

export const useHome = (): HomeData => {
  const { publicKey } = useWallet();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [homeStats, setHomeStats] = useState<HomeStats>(initialHomeStats);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize standardized error handler
  const errorHandler = createErrorHandler(setError, 'useHome');

  const fetchHomeData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [solPrice, marketData, fetchedUserStats] = await Promise.all([
        priceService.getSolPrice(),
        statsService.getMarketData(),
        publicKey ? statsService.getUserStats(publicKey.toBase58()) : Promise.resolve(null),
      ]);

      debugLog('marketData from API:', marketData);
      debugLog('fetchedUserStats from API:', fetchedUserStats);

      const platformStats: HomeStats = {
        totalValue: marketData.totalValue ?? 0,
        totalUsers: marketData.totalUsers ?? 0,
        totalTransactions: marketData.totalTransactions ?? 0,
        averageDeposit: marketData.averageDeposit ?? 0,
        solPrice,
      };

      setHomeStats(platformStats);
      if (fetchedUserStats) {
        const userStatsData: UserStats = {
          totalBalance: Number(fetchedUserStats.totalBalance) || 0,
          totalEarned: Number(fetchedUserStats.totalEarned) || 0,
          activeStakes: Number(fetchedUserStats.activeStakes) || 0,
          tier: fetchedUserStats.tier as string || null,
          rank: Number(fetchedUserStats.rank) || null,
        };
        setUserStats(userStatsData);
      }
    } catch (err) {
      errorHandler.handleError(err, {
        context: 'fetchHomeData',
        fallbackMessage: ErrorMessages.API_ERROR
      });
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, errorHandler]);

  useEffect(() => {
    const REFRESH_MS = import.meta.env.DEV ? 30000 : 60000;
    const gate = startIntervalWhenVisible(fetchHomeData, REFRESH_MS);
    return () => gate.stop();
  }, [fetchHomeData]);

  return { userStats, homeStats, isLoading, error, fetchHomeData };
};