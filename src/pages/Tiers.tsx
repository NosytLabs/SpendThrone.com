import { LoadingSpinner, Card, Button, RoyalCard, GlowCard, ShimmerCard, AnimatedCard, useToast, RoyalIcon } from '../components/ui';
import { PageLayout } from '../components/layout/PageLayout';
import { PageHeader } from '../components/layout/PageHeader';
import { Section } from '../components/layout/Section';
import { useTiers } from '@/shared/hooks/useTiers';
import { APP_CONFIG } from '@/core/constants/appConfig';

const Tiers = () => {
  const { loading } = useTiers();
  const { addToast } = useToast();

  if (loading) {
    return (
      <PageLayout>
        <Section title="Loading Tiers" subtitle="Fetching royal decrees...">
          <AnimatedCard entrance="fade-in" entranceDelay={200} className="flex items-center justify-center p-8">
            <LoadingSpinner variant="lottie" size={120} message="Loading..." showMessage={true} />
          </AnimatedCard>
        </Section>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      maxWidth="full"
      showBackgroundEffects={true}
    >
      <PageHeader
        title="The Hierarchy"
        subtitle="There are only three positions that matter. The rest are spectators."
        icon={<RoyalIcon variant="crown" size={48} className="drop-shadow-glow" />}
        variant="compact"
      />
      <Section className="w-full max-w-7xl mx-auto">
        {/* THE PODIUM */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 items-end max-w-6xl mx-auto">
          {/* RANK 2 - SILVER */}
          <ShimmerCard
            shimmerOnHover={true}
            entrance="slide-up"
            entranceDelay={300}
            className="p-8 text-center md:order-1 order-2 transform md:translate-y-8 border-4 border-tier-silver/20 bg-gradient-to-b from-surface-tertiary/50 to-background-primary cursor-pointer"
            onClick={() => addToast({
              type: 'info',
              title: 'Silver Tier',
              description: 'Almost there! Keep climbing the ranks!',
              duration: 3000
            })}
          >
            <div className="text-6xl mb-4">🥈</div>
            <h3 className="royal-text-title text-text-primary mb-2">RANK 2</h3>
            <p className="text-lg text-text-secondary mb-6 font-serif italic">The Silver Medallist</p>
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3 text-text-primary">
                <RoyalIcon variant="trophy" size={20} className="filter drop-shadow-[0_0_2px_var(--color-tier-silver)]" />
                <span>The Silver Trophy</span>
              </div>
              <div className="flex items-center gap-3 text-text-primary">
                <RoyalIcon variant="star" size={20} className="filter drop-shadow-[0_0_2px_var(--color-tier-silver)]" />
                <span>Almost Famous</span>
              </div>
              <div className="flex items-center gap-3 text-text-primary">
                <RoyalIcon variant="medal" size={20} className="filter drop-shadow-[0_0_2px_var(--color-tier-silver)]" />
                <span>Eternal Regret</span>
              </div>
            </div>
            <p className="text-xs text-text-muted mt-6 italic">
              &quot;Second place is the first loser.&quot;
            </p>
          </ShimmerCard>

          {/* RANK 1 - GOLD (EMPEROR) */}
          <RoyalCard
            glowOnHover={true}
            entrance="scale"
            entranceDelay={500}
            className="p-8 md:p-10 text-center md:order-2 order-1 transform md:-translate-y-8 z-10 border-4 border-accent-secondary shadow-2xl shadow-accent-secondary/30 bg-gradient-to-b from-accent-secondary/20 via-accent-secondary/10 to-black relative overflow-visible cursor-pointer mb-8 md:mb-0"
            onClick={() => addToast({
              type: 'success',
              title: '👑 EMPEROR TIER',
              description: 'The pinnacle of digital sovereignty!',
              duration: 4000
            })}
          >
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 animate-bounce">
              <RoyalIcon variant="crown" size={64} className="filter drop-shadow-[0_0_15px_var(--color-gold-400)]" />
            </div>
            <div className="mt-12">
              <div className="text-8xl mb-4">👑</div>
              <h3 className="royal-text-hero text-accent-secondary mb-3 drop-shadow-glow">RANK 1</h3>
              <p className="text-2xl text-white mb-8 font-serif italic">THE EMPEROR</p>
              <div className="space-y-4 text-left bg-black/30 p-6 rounded-lg border border-accent-secondary/30">
                <div className="flex items-center gap-3 text-white">
                  <RoyalIcon variant="star" size={24} className="filter drop-shadow-[0_0_5px_var(--color-gold-400)]" />
                  <span className="text-lg">The Golden Crown</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <RoyalIcon variant="trophy" size={24} className="filter drop-shadow-[0_0_5px_var(--color-gold-400)]" />
                  <span className="text-lg">Top of the Leaderboard</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <RoyalIcon variant="diamond" size={24} className="filter drop-shadow-[0_0_5px_var(--color-gold-400)]" />
                  <span className="text-lg">Eternal Glory</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <RoyalIcon variant="fire" size={24} className="filter drop-shadow-[0_0_5px_var(--color-gold-400)]" />
                  <span className="text-lg">Bragging Rights for Life</span>
                </div>
              </div>
              <p className="text-sm text-accent-secondary mt-6 italic font-semibold">
                &quot;Veni, vidi, vici. I came, I saw, I paid more.&quot;
              </p>
            </div>
          </RoyalCard>

          {/* RANK 3 - BRONZE */}
          <GlowCard
            glowOnHover={true}
            entrance="slide-up"
            entranceDelay={700}
            className="p-8 text-center md:order-3 order-3 transform md:translate-y-8 border-4 border-tier-bronze/40 bg-gradient-to-b from-tier-bronze/20 to-background-primary cursor-pointer"
            onClick={() => addToast({
              type: 'warning',
              title: 'Bronze Tier',
              description: 'Good start! Aim higher next time!',
              duration: 2500
            })}
          >
            <div className="text-6xl mb-4">🥉</div>
            <h3 className="royal-text-title text-tier-bronze mb-2">RANK 3</h3>
            <p className="text-lg text-tier-bronze mb-6 font-serif italic">The Bronze Contender</p>
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3 text-tier-bronze">
                <RoyalIcon variant="trophy" size={20} className="filter drop-shadow-[0_0_2px_var(--color-tier-bronze)]" />
                <span>The Bronze Trophy</span>
              </div>
              <div className="flex items-center gap-3 text-tier-bronze">
                <RoyalIcon variant="target" size={20} className="filter drop-shadow-[0_0_2px_var(--color-tier-bronze)]" />
                <span>Podium Position</span>
              </div>
              <div className="flex items-center gap-3 text-tier-bronze">
                <RoyalIcon variant="trend" size={20} className="filter drop-shadow-[0_0_2px_var(--color-tier-bronze)]" />
                <span>Room for Growth</span>
              </div>
            </div>
            <p className="text-xs text-text-muted mt-6 italic">
              &quot;At least you&apos;re on the podium.&quot;
            </p>
          </GlowCard>
        </div>

        {/* EVERYONE ELSE */}
        <div className="container mx-auto w-full">
          <Card variant="glass" className="p-8 mb-12 border-l-4 border-text-muted">
            <h2 className="royal-text-title text-white mb-4">Rank 4+: The Spectators</h2>
            <p className="text-text-secondary text-lg mb-6">
              If you&apos;re not in the Top 3, you&apos;re part of the audience. You paid to watch.
              Your name is on the list, but nobody scrolls that far.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-background-secondary/50 p-4 rounded-lg border border-border-primary">
                <h4 className="font-bold text-text-muted mb-2">Rank 4-10: The Nobility</h4>
                <p className="text-text-secondary text-sm">You get a diamond icon. Congratulations on being &quot;above average.&quot;</p>
              </div>
              <div className="bg-background-secondary/50 p-4 rounded-lg border border-border-primary">
                <h4 className="font-bold text-text-muted mb-2">Rank 11-50: The Merchants</h4>
                <p className="text-text-secondary text-sm">You tried. We appreciate that.</p>
              </div>
              <div className="bg-background-secondary/50 p-4 rounded-lg border border-border-primary">
                <h4 className="font-bold text-text-muted mb-2">Rank 51+: The Peasants</h4>
                <p className="text-text-secondary text-sm">
                  The faceless masses. You exist to witness the glory of the few. 
                  <br/>
                  <span className="text-xs italic opacity-70">At least you&apos;re on the blockchain forever.</span>
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* HOW IT WORKS */}
        <Section
          title={APP_CONFIG.SECTIONS.HOW_RANKINGS_WORK}
          subtitle="The mechanics of the eternal war for #1"
        >
          <div className="grid md:grid-cols-2 gap-8">
            <Card variant="glass" className="p-8 border-l-4 border-accent-primary">
              <h4 className="royal-text-subtitle text-white mb-4 flex items-center gap-2">
                <RoyalIcon variant="trend" size={28} className="drop-shadow-glow" />
                Dynamic Ranking
              </h4>
              <p className="text-text-secondary text-lg leading-relaxed">
                Rankings are based on <strong className="text-white">Total USD Value</strong> contributed (all deposits combined).
                <br /><br />
                <strong className="text-accent-primary">Example:</strong>
                <br />• User A deposits $100 → Rank #1
                <br />• User B deposits $150 → User B is now #1, User A drops to #2
                <br />• User A deposits another $100 ($200 total) → User A reclaims #1
                <br /><br />
                It is a constant war for the top spot.
              </p>
              <Button as="link" to="/history" variant="ghost" size="sm" className="mt-4 text-accent-primary hover:underline p-0">
                → Learn why people fight for status
              </Button>
            </Card>
            <Card variant="glass" className="p-8 border-l-4 border-accent-primary">
              <h4 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <RoyalIcon variant="crown" size={28} className="filter drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]" />
                The Crown
              </h4>
              <p className="text-text-secondary text-lg leading-relaxed">
                Only one person can wear the Crown (Rank 1).
                <br /><br />
                Everyone else is just waiting for their turn to pay more.
                The Emperor&apos;s throne is never safe.
                <br /><br />
                <strong className="text-accent-primary">Your legacy is only as good as your last deposit.</strong>
              </p>
            </Card>
          </div>
        </Section>

        {/* CTA */}
        <RoyalCard className="mt-12 text-center p-12 bg-gradient-to-r from-accent-secondary via-accent-secondary to-accent-secondary rounded-2xl shadow-2xl border-4 border-white/50">
          <h2 className="text-4xl font-extrabold text-black mb-4">
            Will You Be Emperor?
          </h2>
          <p className="text-xl text-black/80 mb-6 max-w-2xl mx-auto">
            The throne is waiting. The only question is: how much are you willing to pay for eternal glory?
          </p>
          <Button 
            as="link"
            to="/"
            className="bg-black text-accent-secondary font-bold py-4 px-10 rounded-full text-xl hover:scale-110 transition-transform shadow-2xl border-4 border-accent-secondary h-auto"
            onClick={() => addToast({
              type: 'success',
              title: 'Claim Your Throne!',
              description: "Time to show them who's boss!",
              duration: 3500
            })}
          >
            Pay Tribute Now
          </Button>
        </RoyalCard>
      </Section>
    </PageLayout>
  );
};

export default Tiers;
