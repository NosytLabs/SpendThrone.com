import React from 'react';
import { RoyalCard, RoyalIcon } from '@/components/ui';
import { formatCurrency } from '@/shared/utils/formatting/currency';
import { UserData, RankHistoryPoint } from '@/shared/utils/types';

interface AnalyticsTabProps {
  userData: UserData;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ userData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Contribution Trend */}
      <RoyalCard className="p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <RoyalIcon variant="trend" className="text-accent-secondary" />
          Contribution Trend
        </h3>
        <div className="space-y-3">
          {userData.stats.rankHistory.slice(-6).map((data: RankHistoryPoint, index: number) => {
            // Calculate previous rank for trend comparison
            // If index > 0, compare with previous item in this slice
            // If index === 0, try to find the item before it in the full array
            const fullHistory = userData.stats.rankHistory;
            const sliceStartIndex = Math.max(0, fullHistory.length - 6);
            const currentItemIndex = sliceStartIndex + index;
            const prevItemIndex = currentItemIndex - 1;
            
            let trend: 'up' | 'down' | 'same' = 'same';
            if (prevItemIndex >= 0) {
              const prevRank = fullHistory[prevItemIndex].rank;
              if (data.rank < prevRank) trend = 'up'; // Lower rank number is better (1 is best)
              else if (data.rank > prevRank) trend = 'down';
            }

            return (
              <div key={index} className="flex items-center justify-between">
                <span className="text-text-secondary">{data.date}</span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">#{data.rank}</span>
                  {prevItemIndex >= 0 && trend !== 'same' && (
                    <RoyalIcon 
                      variant={trend === 'up' ? 'trend' : 'trendDown'}
                      size={16}
                      className={trend === 'up' ? 'text-green-500' : 'text-red-500'}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </RoyalCard>

      {/* Statistics */}
      <RoyalCard className="p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <RoyalIcon variant="pieChart" className="text-success" />
          Statistics
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">Average Contribution</span>
            <span className="text-white font-medium">{formatCurrency(userData.stats.averageContribution)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">Largest Contribution</span>
            <span className="text-white font-medium">{formatCurrency(userData.stats.largestContribution)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">Total Transactions</span>
            <span className="text-white font-medium">{userData.totalTransactions}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">Success Rate</span>
            <span className="text-white font-medium">100%</span>
          </div>
        </div>
      </RoyalCard>
    </div>
  );
};
