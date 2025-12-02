import React, { useState } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { PageHeader } from '../components/layout/PageHeader';
import { 
  SkipLink, 
  CopyToClipboard, 
  useUserFeedback,
  KeyboardNavigationHint,
  useKeyboardNavigation,
  createGlobalShortcuts,
  SuccessAnimation,
  EnhancedButton,
  GradientButton,
  BounceAnimation,
  RippleEffect,
  RoyalCard,
  GlowPulse,
  FloatingAnimation,
  RoyalIcon,
  LoadingSpinner,
  useToast
} from '../components/ui';
import { LeaderboardTable } from '../features/leaderboard/LeaderboardTable';
import { KingOfTheHill } from '../features/leaderboard/KingOfTheHill';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { PaymentModal } from '../features/payment/PaymentModal';
import { APP_CONFIG } from '@/core/constants/appConfig';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';

/**
 * The Throne Room (Home)
 * The central hub for the status competition.
 */
export const Home: React.FC = () => {
  const { leaderboard, isLoading, error, refetch } = useLeaderboard();
  const { addToast } = useToast();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [overtakeAmount, setOvertakeAmount] = useState<number>(0);
  const [filter, setFilter] = useState('all');
  const { playSuccess } = useUserFeedback();
  const navigate = useNavigate();
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  // Setup keyboard navigation
  const { registerShortcuts } = useKeyboardNavigation();
  React.useEffect(() => {
    registerShortcuts(createGlobalShortcuts(navigate));
  }, [navigate, registerShortcuts]);

  const handleOvertake = (amount: number) => {
    setOvertakeAmount(amount);
    setIsPaymentModalOpen(true);
    playSuccess(); // Play success sound for better UX
  };

  const handlePaymentModalClose = () => {
    setIsPaymentModalOpen(false);
    // Reset overtake amount after a short delay to ensure modal transition is smooth
    setTimeout(() => setOvertakeAmount(0), 300);
  };

  // Identify the King (Rank 1)
  const king = leaderboard.find(entry => entry.rank === 1) || null;

  return (
    <PageLayout maxWidth="full" showBackgroundEffects={true}>
      <SkipLink href="#leaderboard">Skip to leaderboard</SkipLink>
      
      {/* Keyboard Navigation Hint */}
      <KeyboardNavigationHint 
        shortcuts={[
          { key: '/', description: 'Focus search' },
          { key: 'h', modifier: 'ctrl', description: 'Go to home' },
          { key: 'l', modifier: 'ctrl', description: 'Go to leaderboard' },
          { key: 'p', modifier: 'ctrl', description: 'Open payment modal' }
        ]}
      />

      {/* Hero / CTA Section */}
      <PageHeader
        title="CLAIM THE THRONE"
        subtitle={APP_CONFIG.TAGLINES.HERO}
        icon="crown"
        className="animate-royal-entrance"
      >
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 justify-center items-center w-full max-w-4xl mx-auto">
          <GradientButton
            size="lg"
            data-action="pay-tribute"
            onClick={() => {
              setOvertakeAmount(0);
              setIsPaymentModalOpen(true);
            }}
            className="w-full sm:w-auto sm:min-w-[260px] text-xl font-bold shadow-2xl shadow-accent-primary/30 border-[3px] border-accent-primary/60 hover:shadow-accent-primary/40 transform hover:scale-105 transition-all duration-300"
            hoverScale={true}
          >
            <RoyalIcon variant="diamond" size={28} className="mr-3" />
            PAY TRIBUTE
          </GradientButton>

          <EnhancedButton
            variant="ghost"
            size="lg"
            onClick={() => document.getElementById('leaderboard')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto sm:min-w-[220px] text-lg text-text-secondary hover:text-text-primary border-2 border-border hover:border-border-hover hover:bg-white/5 transition-all duration-300"
          >
            VIEW RANKINGS
          </EnhancedButton>

          <CopyToClipboard
            text={window.location.origin}
            onCopy={() => {
              addToast({ type: 'royal', title: 'Link Copied', description: 'Share the throne with your subjects.' });
              playSuccess();
              // Simplified confetti animation
              confetti({
                origin: { y: 0.7 },
                colors: ['#FFD700', '#FFA500', '#DAA520', '#FFFFFF'],
                particleCount: 25,
                spread: 60
              });
            }}
            className="w-full sm:w-auto sm:min-w-[180px] text-base border-2 border-border text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all duration-300"
            showIcon={false}
          >
            <RoyalIcon variant="chest" size={20} className="mr-2" />
            Share the Throne
          </CopyToClipboard>
        </div>
      </PageHeader>

      {/* Leaderboard Section */}
      <section id="leaderboard" className="w-full max-w-7xl mx-auto" aria-labelledby="leaderboard-heading">
        <div className="w-full">
          
          {/* King of the Hill Display */}
          {!isLoading && !error && king && filter === 'all' && (
            <KingOfTheHill king={king} onDethrone={handleOvertake} />
          )}

          <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
            <div className="relative">
              <FloatingAnimation duration={6000}>
                <GlowPulse color="purple" intensity="subtle" duration={4000}>
                  <div className="absolute -top-4 -left-4 w-8 h-8 opacity-40">
                    <RoyalIcon variant="crown" size={32} className="text-accent-secondary" />
                  </div>
                </GlowPulse>
              </FloatingAnimation>
              <h2 id="leaderboard-heading" className="text-3xl font-bold flex items-center gap-3 text-text-primary">
                <RoyalIcon variant="trophy" size={32} className="filter drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                {APP_CONFIG.SECTIONS.THRONE_RANKINGS}
              </h2>
              <p className="text-text-secondary mt-2">
                {APP_CONFIG.TAGLINES.LEADERBOARD}
              </p>
            </div>

            {/* Filter Tabs */}
          <div className="flex p-1 gap-1 bg-background-primary rounded-lg border border-border-primary overflow-x-auto no-scrollbar max-w-full snap-x" role="tablist" aria-label="Filter leaderboard by tier">
            {['all', 'legendary', 'epic', 'rare', 'common'].map((tier) => (
              <RippleEffect key={tier}>
                <button
                  onClick={() => setFilter(tier)}
                  role="tab"
                  aria-selected={filter === tier}
                  aria-controls={`${tier}-panel`}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap snap-start ${filter === tier
                    ? 'bg-accent-primary text-black shadow-lg'
                    : 'text-text-secondary hover:text-text-primary'
                    }`}
                >
                  <BounceAnimation intensity="subtle" trigger={filter === tier ? 'always' : 'hover'}>
                    {tier.charAt(0).toUpperCase() + tier.slice(1)}
                  </BounceAnimation>
                </button>
              </RippleEffect>
            ))}
          </div>
          </div>

            <RoyalCard className="overflow-hidden border-t-4 border-t-accent-primary shadow-2xl min-h-[400px] relative">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-background-primary/50 backdrop-blur-sm z-10">
                  <div className="flex flex-col items-center">
                    <LoadingSpinner size="lg" className="mb-4" />
                    <p className="text-text-secondary animate-pulse">Summoning the Court...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center h-full">
                  <RoyalIcon variant="warning" size={48} className="text-red-500 mb-4" />
                  <h3 className="text-xl font-bold text-text-primary mb-2">Failed to Load Court</h3>
                  <p className="text-text-secondary mb-6 max-w-md">{error}</p>
                  <EnhancedButton onClick={refetch} variant="primary">
                    Retry Connection
                  </EnhancedButton>
                </div>
              ) : (
                <LeaderboardTable
                  entries={leaderboard}
                  selectedFilter={filter}
                  onOvertake={handleOvertake}
                />
              )}
            </RoyalCard>
        </div>
      </section>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handlePaymentModalClose}
        initialAmount={overtakeAmount}
        onSuccess={() => {
          refetch(); // Refresh leaderboard after payment
          
          // Trigger success animation
          setShowSuccessAnimation(true);
          
          // Trigger confetti
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FFD700', '#FFA500', '#DAA520', '#FFFFFF']
          });

          addToast({
            type: 'royal',
            title: 'Tribute Accepted',
            description: 'Your contribution has been recorded on the blockchain.',
            duration: 5000
          });
        }}
      />

      {/* Success Animation */}
      <SuccessAnimation
        show={showSuccessAnimation}
        onComplete={() => setShowSuccessAnimation(false)}
        size="lg"
        position="center"
      />
    </PageLayout>
  );
};

export default Home;