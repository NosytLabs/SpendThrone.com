import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { RoyalIcon, RoyalCard } from '@/components/ui';

export const Legal: React.FC = () => {
    return (
        <PageLayout maxWidth="lg" showBackgroundEffects={true}>
            <PageHeader
                title="Royal Decree"
                subtitle="Terms of Engagement & Social Contract"
                icon="scroll"
            />

            <div className="space-y-8 pb-12">
                <RoyalCard className="p-8 prose prose-invert prose-gold max-w-none">
                    <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                        <RoyalIcon variant="crown" className="text-accent-primary" size={24} />
                        <h2 className="text-2xl font-cinzel text-accent-primary m-0">The Social Experiment</h2>
                    </div>
                    
                    <p className="text-lg text-text-primary leading-relaxed">
                        By connecting your wallet and participating in <strong>SpendThrone.com</strong>, you explicitly acknowledge and agree that this platform is a 
                        <strong> satire, a social experiment, and a piece of interactive performance art</strong>.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 my-8">
                        <div className="bg-black/40 p-6 rounded-lg border border-accent-primary/20">
                            <h3 className="text-accent-secondary font-bold mb-2 flex items-center gap-2">
                                <RoyalIcon variant="coins" size={16} /> Nature of Tributes
                            </h3>
                            <p className="text-sm text-text-secondary">
                                &quot;Tributes&quot;, &quot;Spends&quot;, and &quot;Sacrifices&quot; are non-refundable <strong>donations</strong> to the void (or the developers). 
                                They purchase <strong>nothing</strong> of tangible value. 
                                You are buying a digital number on a scoreboard. That is all.
                            </p>
                        </div>

                        <div className="bg-black/40 p-6 rounded-lg border border-accent-primary/20">
                            <h3 className="text-accent-secondary font-bold mb-2 flex items-center gap-2">
                                <RoyalIcon variant="warning" size={16} /> No Returns
                            </h3>
                            <p className="text-sm text-text-secondary">
                                All blockchain transactions are final. There are no refunds, no chargebacks, and no &quot;speaking to the manager&quot;. 
                                The King does not handle customer support.
                            </p>
                        </div>
                    </div>

                    <h3 className="text-xl font-cinzel text-accent-primary mt-8 mb-4">Article I: Absurdity</h3>
                    <p>
                        This site is a historical commentary on &quot;Conspicuous Consumption&quot; and the &quot;Handicap Principle&quot;. 
                        By spending money here, you are proving you have money to waste. 
                        If you cannot afford to waste it, <strong>do not spend it</strong>.
                    </p>

                    <h3 className="text-xl font-cinzel text-accent-primary mt-8 mb-4">Article II: Data & Privacy</h3>
                    <p>
                        We respect the anonymity of the blockchain.
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-text-secondary">
                        <li>We do not collect emails, passwords, or personal names.</li>
                        <li>We track public wallet addresses to maintain the Leaderboard.</li>
                        <li>We use anonymous analytics (e.g., PostHog) to see how many people are laughing at the joke.</li>
                        <li>Your &quot;Link&quot; and &quot;Message&quot; are public graffiti. Do not doxx yourself.</li>
                    </ul>

                    <h3 className="text-xl font-cinzel text-accent-primary mt-8 mb-4">Article III: Liability</h3>
                    <p>
                        The creators (&quot;The Crown&quot;) accept no liability for lost funds, failed transactions, broken egos, or the eventual heat death of the universe. 
                        Use this software AS IS. It is barely held together by magic and code.
                    </p>

                    <div className="mt-12 p-6 bg-accent-primary/5 border border-accent-primary/30 rounded-lg text-center">
                        <p className="font-cinzel text-accent-primary text-xl mb-2">Signed & Decreed</p>
                        <p className="text-sm text-text-muted">The Anon Dev Team</p>
                        <p className="text-xs text-text-muted/50 mt-1">Est. 2025</p>
                    </div>
                </RoyalCard>
            </div>
        </PageLayout>
    );
};
