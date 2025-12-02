import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useWallet } from '@solana/wallet-adapter-react';
import { LeaderboardTable } from '@/features/leaderboard/LeaderboardTable';
import { LeaderboardFilters } from '@/features/leaderboard/LeaderboardFilters';
import { PaymentModal } from '@/features/payment/PaymentModal';
import { RoyalIcon } from '@/components/ui';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useDegradedMode } from '@/core/hooks/useDegradedMode';
import { apiService } from '@/core/api-service';
import { LoadingLeaderboard } from '@/shared/components/LoadingDisplay';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageHeader } from '@/components/layout/PageHeader';

const Leaderboard: React.FC = () => {
  const { publicKey } = useWallet();
  const { leaderboard, isLoading, error, refetch } = useLeaderboard();
  const { isDegraded, reason } = useDegradedMode();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [userRank, setUserRank] = useState<number | null>(null);

  // Find user's rank in the leaderboard
  useEffect(() => {
    if (publicKey && leaderboard.length > 0) {
      const userEntry = leaderboard.find(entry => entry.walletAddress === publicKey.toString());
      setUserRank(userEntry?.rank || null);
    } else {
      setUserRank(null);
    }
  }, [publicKey, leaderboard]);

  // Fetch referral stats
  useEffect(() => {
    if (publicKey) {
      // Fetch referral stats but we don't store them locally as they might be handled by the service context
      apiService.getReferralStats(publicKey.toString()).catch(() => {
        // Silently handle referral stats fetch errors
      });
    }
  }, [publicKey]);

  const handleOvertake = (amount: number) => {
    if (isDegraded) {
      // Don't open payment modal in degraded mode
      return;
    }
    setPaymentAmount(amount);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    setIsPaymentModalOpen(false);
    refetch(); // Refresh leaderboard after successful payment
  };

  return (
    <PageLayout maxWidth="full" showBackgroundEffects={true}>
      <Helmet>
        <title>Leaderboard | SpendThrone</title>
        <meta name="description" content="View the top contributors and compete for the throne on SpendThrone" />
      </Helmet>

      <div className="w-full max-w-7xl mx-auto">
          {/* Header */}
          <PageHeader
            title="Noble Leaderboard"
            subtitle="Compete for glory and eternal recognition. The throne awaits those who dare to claim it."
            icon="crown"
            variant="default"
          />

          {/* Degraded Mode Banner */}
          {isDegraded && (
            <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <RoyalIcon variant="warning" size={20} className="text-warning" />
                <div>
                  <h3 className="font-semibold text-warning">Limited Functionality</h3>
                  <p className="text-sm text-warning/80">{reason}</p>
                </div>
              </div>
            </div>
          )}

          {/* User Rank Card */}
          {userRank && (
            <div className="bg-surface border border-border rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent-primary/10 flex items-center justify-center">
                    <RoyalIcon variant="user" size={24} className="text-accent-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">Your Rank</h3>
                    <p className="text-2xl font-bold text-accent-primary">#{userRank}</p>
                  </div>
                </div>
                {!isDegraded && (
                  <button
                    onClick={() => handleOvertake(leaderboard[userRank - 2]?.totalUsdValue + 1 || 1)}
                    className="bg-accent-primary hover:bg-accent-primary/80 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <RoyalIcon variant="trend" size={16} />
                    Climb Higher
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="mb-6">
            <LeaderboardFilters 
              selectedFilter={selectedFilter} 
              onFilterChange={setSelectedFilter}
              disabled={isLoading}
            />
          </div>

          {/* Leaderboard Table */}
          {isLoading || error ? (
            <LoadingLeaderboard
              isLoading={isLoading}
              error={error || undefined}
              onRetry={refetch}
            />
          ) : (
            <LeaderboardTable 
              entries={leaderboard}
              selectedFilter={selectedFilter}
              userRank={userRank}
              onOvertake={handleOvertake}
            />
          )}

          {/* Stats Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-text-muted">
              Showing {leaderboard.length} nobles • Updated every 5 minutes
            </p>
          </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={handlePaymentSuccess}
        initialAmount={paymentAmount}
      />
    </PageLayout>
  );
};

export default Leaderboard;