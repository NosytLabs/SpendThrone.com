import React from 'react';
import { RoyalCard, Badge, RoyalIcon, EntranceAnimation } from '@/components/ui';
import { formatCurrency } from '@/shared/utils/formatting/currency';
import { formatDistanceToNow } from 'date-fns';
import { Transaction } from '@/shared/utils/types';

interface HistoryTabProps {
  transactions: Transaction[];
}

export const HistoryTab: React.FC<HistoryTabProps> = ({ transactions }) => {
  return (
    <RoyalCard className="p-6">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <RoyalIcon variant="history" className="text-accent-primary" />
        Recent Transactions
      </h3>
      <div className="space-y-4">
        {transactions.map((tx: Transaction, index: number) => (
          <EntranceAnimation key={tx.id} type="slide-up" delay={index * 50}>
            <div className="flex items-center justify-between p-4 bg-background-secondary/30 rounded-lg border border-border-primary hover:border-accent-primary/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  tx.type === 'tribute' ? 'bg-accent-primary/20' : 'bg-accent-secondary/20'
                }`}>
                  <RoyalIcon 
                    variant={tx.type === 'tribute' ? 'arrowUp' : 'arrowDown'} 
                    className={tx.type === 'tribute' ? 'text-accent-primary' : 'text-accent-secondary'} 
                  />
                </div>
                  <div>
                    <div className="font-medium text-white">
                      {tx.type === 'tribute' ? 'Tribute Paid' : 'Other'}
                    </div>
                    <div className="text-sm text-text-secondary">
                      {formatDistanceToNow(new Date(tx.timestamp), { addSuffix: true })}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-white">{formatCurrency(tx.amount)}</div>
                  <div className="text-sm text-text-secondary">{tx.currency}</div>
                  {tx.rankChange !== 0 && (
                    <Badge className={`mt-1 text-xs ${
                      tx.rankChange > 0 ? 'bg-green-500' : 'bg-red-500'
                    } text-white`}>
                      {tx.rankChange > 0 ? '+' : ''}{tx.rankChange} rank
                    </Badge>
                  )}
                </div>
              </div>
            </EntranceAnimation>
          ))}
        </div>
      </RoyalCard>
  );
};
