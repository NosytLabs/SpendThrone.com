import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { KingOfTheHill } from '@/features/leaderboard/KingOfTheHill';
import { LeaderboardTable } from '@/features/leaderboard/LeaderboardTable';
import { LeaderboardFilters } from '@/features/leaderboard/LeaderboardFilters';
import { UserRankCard } from '@/features/leaderboard/components/UserRankCard';
import { PaymentModal } from '@/features/payment/PaymentModal';
import { RoyalIcon } from '@/components/ui';
import { useLeaderboard } from '@/features/leaderboard/hooks/useLeaderboard';
import { useDegradedMode } from '@/shared/hooks/useDegradedMode';
import { LoadingLeaderboard } from '@/shared/components/LoadingDisplay';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import strings from '@/locales/strings.json';

const Leaderboard: React.FC = () => {
  const { leaderboard, isLoading, error, refetch, userRank } = useLeaderboard();
  const { isDegraded, reason } = useDegradedMode();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);

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
        <title>{strings.leaderboard.meta_title}</title>
        <meta name="description" content={strings.leaderboard.meta_description} />
      </Helmet>

      <div className="w-full max-w-7xl mx-auto">
          {/* Header */}
          <PageHeader
            title={strings.leaderboard.page_title}
            subtitle={strings.leaderboard.page_subtitle}
            icon="crown"
            variant="default"
          />

          {/* King of the Hill */}
          {!isLoading && !error && leaderboard.length > 0 && (
            <KingOfTheHill 
              king={leaderboard[0]} 
              onDethrone={!isDegraded ? handleOvertake : undefined} 
            />
          )}

          {/* Degraded Mode Banner */}
          {isDegraded && (
            <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <RoyalIcon variant="warning" size={20} className="text-warning" />
                <div>
                  <h3 className="font-semibold text-warning">{strings.leaderboard.limited_functionality}</h3>
                  <p className="text-sm text-warning/80">{reason}</p>
                </div>
              </div>
            </div>
          )}

          {/* User Rank Card */}
          {userRank && (
            <UserRankCard
                userRank={userRank}
                leaderboard={leaderboard}
                isDegraded={isDegraded}
                onOvertake={handleOvertake}
            />
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
