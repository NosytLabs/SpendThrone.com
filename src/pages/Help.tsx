import React from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { PageHeader } from '../components/layout/PageHeader';
import { RoyalCard, RoyalIcon, Button, EntranceAnimation } from '../components/ui';

const Help: React.FC = () => {
  return (
    <PageLayout
      maxWidth="full"
      showBackgroundEffects={true}
    >
      <PageHeader
        title="Royal Support"
        subtitle="Guidance for aspiring nobles and confused peasants."
        icon="book"
        variant="compact"
      />

      <div className="w-full max-w-5xl mx-auto">

        {/* FAQ SECTION */}
        <RoyalCard variant="glass" className="p-8 mb-8">
          <h2 className="royal-text-title text-white mb-8 flex items-center gap-3">
            <RoyalIcon variant="idea" className="text-accent-primary" />
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-8">
            <div className="border-l-2 border-accent-primary/30 pl-6">
              <h3 className="text-xl font-bold text-white mb-2">Can I withdraw my tribute?</h3>
              <p className="text-text-secondary leading-relaxed">
                <strong className="text-error">No.</strong> All tributes are permanent donations to the Kingdom Treasury. There are no refunds, no withdrawals, and no &quot;undo&quot; button. This is a one-way transaction for status.
              </p>
            </div>

            <div className="border-l-2 border-accent-primary/30 pl-6">
              <h3 className="text-xl font-bold text-white mb-2">What do I get for winning?</h3>
              <p className="text-text-secondary leading-relaxed">
                You get to be #1. You get the Crown icon. You get the envy of everyone beneath you. You do <strong className="text-white">not</strong> get any financial return, tokens, or prizes. The prize is the status itself.
              </p>
            </div>

            <div className="border-l-2 border-accent-primary/30 pl-6">
              <h3 className="text-xl font-bold text-white mb-2">How are ranks calculated?</h3>
              <p className="text-text-secondary leading-relaxed">
                Ranks are based on <strong className="text-accent-primary">Total USD Value Contributed</strong>. We track the historical USD value of every deposit you make. The person with the highest cumulative total holds the throne.
              </p>
            </div>

            <div className="border-l-2 border-accent-primary/30 pl-6">
              <h3 className="text-xl font-bold text-white mb-2">What tokens can I use?</h3>
              <p className="text-text-secondary leading-relaxed">
                You can pay directly with <strong className="text-white">SOL</strong>, or use our integrated Jupiter swap to pay with <strong className="text-white">USDC, BONK, WIF</strong>, or almost any other Solana token. Everything is converted to value for the treasury.
              </p>
            </div>
          </div>
        </RoyalCard>

        {/* COMMUNITY SUPPORT */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <EntranceAnimation delay={200} type="slide-up">
            <RoyalCard className="p-8 h-full text-center hover:border-accent-primary transition-colors">
              <RoyalIcon variant="twitter" size={48} className="text-[#1DA1F2] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Twitter / X</h3>
              <p className="text-text-secondary mb-6 text-sm">
                Follow us for leaderboard updates, shaming of fallen kings, and general mockery of the poor.
              </p>
              <Button 
                variant="outline" 
                onClick={() => window.open('https://twitter.com/SpendThrone', '_blank')}
                className="w-full border-[#1DA1F2] text-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white"
              >
                Follow @SpendThrone
              </Button>
            </RoyalCard>
          </EntranceAnimation>

          <EntranceAnimation delay={300} type="slide-up">
            <RoyalCard className="p-8 h-full text-center hover:border-[#5865F2] transition-colors">
              <RoyalIcon variant="discord" size={48} className="text-[#5865F2] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Discord</h3>
              <p className="text-text-secondary mb-6 text-sm">
                Join the court. Brag about your rank. Complain about gas fees. Worship the Emperor.
              </p>
              <Button 
                variant="outline" 
                onClick={() => window.open('https://discord.gg/SpendThrone', '_blank')}
                className="w-full border-[#5865F2] text-[#5865F2] hover:bg-[#5865F2] hover:text-white"
              >
                Join the Court
              </Button>
            </RoyalCard>
          </EntranceAnimation>
        </div>

        {/* TECHNICAL SUPPORT */}
        <RoyalCard variant="glass" className="p-8 border-l-4 border-warning bg-warning/5">
          <div className="flex items-start gap-4">
            <div className="bg-warning/20 p-3 rounded-full hidden sm:block">
              <RoyalIcon variant="warning" size={24} className="text-warning" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <RoyalIcon variant="warning" size={20} className="text-warning sm:hidden" />
                Technical Issue?
              </h3>
              <p className="text-text-secondary text-sm mb-4">
                If you experienced a transaction failure or a display bug, please check your wallet activity first. Remember that blockchain transactions can sometimes take a moment to confirm. You can also check <a href="https://status.solana.com" target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:underline">Solana Network Status</a>.
              </p>
              <div className="inline-block bg-black/30 px-4 py-2 rounded border border-white/10 text-sm font-mono text-accent-primary">
                Support Email: support@spendthrone.com
              </div>
            </div>
          </div>
        </RoyalCard>

      </div>
    </PageLayout>
  );
};

export default Help;
