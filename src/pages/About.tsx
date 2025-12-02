import React from 'react';
import { useAppNavigation } from '@/shared/utils/navigation';
import { PageLayout } from '../components/layout/PageLayout';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, RoyalIcon } from '../components/ui';
import { APP_CONFIG } from '@/core/constants/appConfig';

const About: React.FC = () => {
  const { navigateTo } = useAppNavigation();

  return (
    <PageLayout
      maxWidth="full"
      showBackgroundEffects={true}
    >
      <PageHeader
        title="The Experiment"
        subtitle="What happens when you strip away all utility and leave only status?"
        icon="lightbulb"
        variant="compact"
      />
      <div className="w-full max-w-5xl mx-auto">

        {/* THE HYPOTHESIS */}
        <Card variant="glass" className="p-8 mb-8 border-l-4 border-accent-primary">
          <h2 className="royal-text-title text-white mb-6 flex items-center gap-3">
            <RoyalIcon variant="lightbulb" className="text-accent-primary" />
            The Hypothesis
          </h2>
          <div className="prose prose-invert max-w-none text-lg text-text-secondary space-y-6">
            <p className="text-xl font-medium text-white">
              When presented with a public, immutable leaderboard, individuals will voluntarily destroy wealth purely to signal dominance over others.
            </p>
            <p>
              {APP_CONFIG.APP_NAME_DISPLAY} is a live social experiment running on the Solana blockchain.
              We&apos;ve removed every rational reason to participate. There are:
            </p>
            <div className="grid md:grid-cols-3 gap-6 my-6">
              <div className="bg-background-secondary/50 p-4 rounded-lg border border-error/30 hover:border-error/50 transition-colors">
                <h4 className="font-bold text-error mb-2 flex items-center gap-2">
                  <RoyalIcon variant="close" size={16} className="text-error" /> No Refunds
                </h4>
                <p className="text-sm text-text-secondary">Your tribute is permanent.</p>
              </div>
              <div className="bg-background-secondary/50 p-4 rounded-lg border border-error/30 hover:border-error/50 transition-colors">
                <h4 className="font-bold text-error mb-2 flex items-center gap-2">
                  <RoyalIcon variant="lock" size={16} className="text-error" /> No Withdrawals
                </h4>
                <p className="text-sm text-text-secondary">Contributions are locked forever.</p>
              </div>
              <div className="bg-background-secondary/50 p-4 rounded-lg border border-error/30 hover:border-error/50 transition-colors">
                <h4 className="font-bold text-error mb-2 flex items-center gap-2">
                  <RoyalIcon variant="zap" size={16} className="text-error" /> No Utility
                </h4>
                <p className="text-sm text-text-secondary">No tokens, no rewards, no promises.</p>
              </div>
            </div>
            <p className="text-white font-semibold text-xl">
              All you get is a number on a leaderboard. That&apos;s it.
            </p>
            <p>
              Will people still pay? History suggests: <strong className="text-accent-primary">yes</strong>.
            </p>
          </div>
        </Card>

        {/* THE ROYAL DECREE (Two Pillars) */}
        <Card variant="glass" className="p-8 mb-8">
          <h2 className="royal-text-title text-white mb-6">The Royal Decree</h2>
          <div className="grid md:grid-cols-2 gap-8">

            {/* Pillar 1: Treasury */}
            <div className="bg-background-secondary/50 p-6 rounded-xl border border-accent-secondary/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-accent-secondary/20 rounded-lg">
                  <RoyalIcon variant="lock" className="text-accent-secondary" size={24} />
                </div>
                <h3 className="royal-text-subtitle text-white">The Kingdom Treasury</h3>
              </div>
              <p className="text-text-secondary mb-4">
                Also known as &ldquo;The Royal Coffers&rdquo;. This is the permanent destination for all tributes.
              </p>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-center gap-2">
                  <RoyalIcon variant="check" size={14} className="text-success" />
                  <span>100% of tributes land here</span>
                </li>
                <li className="flex items-center gap-2">
                  <RoyalIcon variant="check" size={14} className="text-success" />
                  <span>Funds are locked forever</span>
                </li>
                <li className="flex items-center gap-2">
                  <RoyalIcon variant="check" size={14} className="text-success" />
                  <span>Permanent display of wealth</span>
                </li>
              </ul>
            </div>

            {/* Pillar 2: Divine Favor */}
            <div className="bg-background-secondary/50 p-6 rounded-xl border border-accent-secondary/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-accent-secondary/20 rounded-lg">
                  <RoyalIcon variant="sparkles" className="text-accent-secondary" size={24} />
                </div>
                <h3 className="royal-text-subtitle text-white">Divine Favor</h3>
              </div>
              <p className="text-text-secondary mb-4">
                A measure of your loyalty to the Kingdom. Earn favor by paying tribute.
              </p>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-center gap-2">
                  <RoyalIcon variant="check" size={14} className="text-accent-secondary" />
                  <span>1 USD Tribute = 1 Divine Favor</span>
                </li>
                <li className="flex items-center gap-2">
                  <RoyalIcon variant="check" size={14} className="text-accent-secondary" />
                  <span>Tracked on the Leaderboard</span>
                </li>
                <li className="flex items-center gap-2">
                  <RoyalIcon variant="check" size={14} className="text-accent-secondary" />
                  <span>Potential future blessings (No Promises)</span>
                </li>
              </ul>
            </div>

          </div>
        </Card>

        {/* WHY SOLANA */}
        <Card variant="glass" className="p-8 mb-8">
          <h2 className="royal-text-title text-white mb-6">Why Solana?</h2>
          <div className="space-y-4 text-text-secondary">
            <p>
              Solana is the perfect blockchain for this experiment:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <RoyalIcon variant="check" size={18} className="text-accent-primary mt-1 flex-shrink-0" />
                <span><strong className="text-white">Immutable:</strong> Transactions can&apos;t be reversed or deleted. Your tribute is eternal.</span>
              </li>
              <li className="flex items-start gap-3">
                <RoyalIcon variant="check" size={18} className="text-accent-primary mt-1 flex-shrink-0" />
                <span><strong className="text-white">Fast & Cheap:</strong> Low fees mean more of your money goes to status, not transaction costs.</span>
              </li>
              <li className="flex items-start gap-3">
                <RoyalIcon variant="check" size={18} className="text-accent-primary mt-1 flex-shrink-0" />
                <span><strong className="text-white">Transparent:</strong> Everyone can verify the leaderboard on-chain. No cheating.</span>
              </li>
              <li className="flex items-start gap-3">
                <RoyalIcon variant="check" size={18} className="text-accent-primary mt-1 flex-shrink-0" />
                <span><strong className="text-white">Global:</strong> Anyone, anywhere can participate. No borders, no restrictions.</span>
              </li>
            </ul>
          </div>
        </Card>

        {/* THE SCIENCE */}
        <Card variant="glass" className="p-8 mb-8 border-l-4 border-accent-secondary">
          <h2 className="royal-text-title text-white mb-4">The Science of Status</h2>
          <div className="space-y-4 text-text-secondary mb-6">
            <p>
              {APP_CONFIG.APP_NAME_DISPLAY} is not just a game; it is an economic demonstration of three core scientific principles:
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <RoyalIcon variant="diamond" size={20} className="text-accent-secondary mt-1 flex-shrink-0" />
                <span>
                  <strong className="text-white">Veblen Goods:</strong> Named after economist <a href="https://en.wikipedia.org/wiki/Thorstein_Veblen" target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:underline">Thorstein Veblen</a>, these are goods for which demand increases as the price increases. They are exclusive status symbols. {APP_CONFIG.APP_NAME_DISPLAY} is the ultimate Veblen Good—it has no utility other than its price.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <RoyalIcon variant="swords" size={20} className="text-accent-secondary mt-1 flex-shrink-0" />
                <span>
                  <strong className="text-white">The Handicap Principle:</strong> Proposed by biologist <a href="https://en.wikipedia.org/wiki/Amotz_Zahavi" target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:underline">Amotz Zahavi</a>, this principle suggests that reliable signals must be costly to the signaler. A peacock&apos;s tail is heavy and dangerous; it proves the bird is strong enough to survive despite it. Burning money on {APP_CONFIG.APP_NAME_DISPLAY} proves you have wealth to spare.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <RoyalIcon variant="zap" size={20} className="text-accent-secondary mt-1 flex-shrink-0" />
                <span>
                  <strong className="text-white">Costly Signaling Theory:</strong> In <a href="https://en.wikipedia.org/wiki/Signalling_theory" target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:underline">game theory</a>, signals that are &ldquo;cheap&rdquo; (easy to fake) are ignored. Signals that are &ldquo;expensive&rdquo; (hard to fake) are trusted. {APP_CONFIG.APP_NAME_DISPLAY} rankings are mathematically unfakable costly signals.
                </span>
              </li>
            </ul>
          </div>
          <button
            className="bg-accent-primary text-black font-bold py-3 px-6 rounded-lg hover:scale-105 transition-transform"
            onClick={() => navigateTo('/history')}
          >
            Read the Full History →
          </button>
        </Card>

        {/* CTA */}
        <Card className="p-12 bg-gradient-to-r from-accent-secondary via-accent-primary to-accent-secondary rounded-2xl border-4 border-accent-primary text-center shadow-2xl">
          <h2 className="text-4xl font-extrabold text-black mb-4">
            Ready to Prove Your Status?
          </h2>
          <p className="text-xl text-black/80 mb-6 max-w-2xl mx-auto">
            Join the experiment. Your tribute is waiting to be immortalized on-chain.
          </p>
          <button
            className="bg-black text-accent-secondary font-bold py-4 px-10 rounded-full text-xl hover:scale-110 transition-transform shadow-2xl border-4 border-accent-secondary"
            onClick={() => navigateTo('/')}
          >
            Pay Tribute Now
          </button>
        </Card>

      </div>
    </PageLayout>
  );
};

export default About;
