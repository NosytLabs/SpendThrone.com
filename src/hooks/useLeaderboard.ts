
import { useState, useEffect, useCallback } from 'react';
import { databaseService } from '@/core/services/databaseService';
import { LeaderboardEntry } from '@/shared/utils/types';
import { createErrorHandler, ErrorMessages } from '@/shared/utils/errorHandler';

export const useLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize standardized error handler
  const errorHandler = createErrorHandler(setError, 'useLeaderboard');

  const fetchLeaderboard = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await databaseService.getLeaderboard(50);
      setLeaderboard(data);
    } catch (err) {
      errorHandler.handleError(err, {
        context: 'fetchLeaderboard',
        fallbackMessage: ErrorMessages.API_ERROR
      });
    } finally {
      setIsLoading(false);
    }
  }, [errorHandler]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return { leaderboard, isLoading, error, refetch: fetchLeaderboard };
};
