import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { APP_CONFIG } from '@/core/constants/appConfig';
import { useLeaderboard } from '@/features/leaderboard/hooks/useLeaderboard';
import { PaymentModal } from '@/features/payment/PaymentModal';
import { Button, RoyalIcon, GlowPulse } from '@/components/ui';
import { useDegradedMode } from '@/shared/hooks/useDegradedMode';
import strings from '@/locales/strings.json';
import { CurrentStatusCard } from '@/features/home/components/CurrentStatusCard';
import { FeatureGrid } from '@/features/home/components/FeatureGrid';

/**
 * Production Home Page
 */
export const Home: React.FC = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { leaderboard, isLoading, refetch } = useLeaderboard();
  const { isDegraded } = useDegradedMode();

  const handlePaymentSuccess = () => {
    setIsPaymentModalOpen(false);
    refetch();
  };

  return (
    <PageLayout maxWidth="full" showBackgroundEffects={true}>
      <Helmet>
        <title>{strings.home.meta_title}</title>
        <meta name="description" content={strings.home.meta_description} />
      </Helmet>
      <PageHeader
        title={strings.home.hero_title}
        subtitle={APP_CONFIG.TAGLINES.HERO}
        icon="crown"
        className=""
      >
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <GlowPulse color="gold" intensity="strong">
                <Button
                    onClick={() => setIsPaymentModalOpen(true)}
                    size="lg"
                    className="royal-shimmer-btn bg-accent-primary text-black font-bold hover:scale-105 transition-transform shadow-lg shadow-accent-primary/20 border-2 border-accent-secondary"
                    disabled={isDegraded}
                >
                    <RoyalIcon variant="crown" className="mr-2" />
                    {strings.common.btn_pay_tribute}
                </Button>
            </GlowPulse>
            <Button
                as="link"
                to="/leaderboard"
                variant="outline"
                size="lg"
                className="border-2 border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-black"
            >
                <RoyalIcon variant="trophy" className="mr-2" />
                {strings.common.btn_view_leaderboard}
            </Button>
        </div>
      </PageHeader>

      <section className="w-full max-w-7xl mx-auto space-y-12 pb-12">
        
        {/* Current Status Card */}
        <CurrentStatusCard 
            leaderboard={leaderboard} 
            isDegraded={isDegraded} 
            onUsurp={() => setIsPaymentModalOpen(true)}
            isLoading={isLoading}
        />

          {/* Feature Grid */}
        <FeatureGrid />
      </section>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={handlePaymentSuccess}
      />
    </PageLayout>
  );
};
