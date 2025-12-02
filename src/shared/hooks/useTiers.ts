import { useState, useEffect } from 'react';
import { apiService } from '@/core/api-service';
import { debugLog } from '@/shared/utils/logger';

export const useTiers = () => {
  const [tiers, setTiers] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTiers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getTiers();
      setTiers(data);
    } catch (err) {
      setError('Failed to fetch tiers data');
      debugLog('Error fetching tiers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTiers();
  }, []);

  return { tiers, loading, error, refetch: fetchTiers };
};

export default useTiers;