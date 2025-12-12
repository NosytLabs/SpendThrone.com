import React, { useState } from 'react';
import { useAppNavigation } from '@/shared/utils/navigation';
import { PageLayout } from '../components/layout/PageLayout';
import { PageHeader } from '../components/layout/PageHeader';
import { RoyalCard, RoyalIcon, Button, EntranceAnimation, GlowPulse } from '../components/ui';
import { WalletIcon } from '../components/ui/WalletIcons';

const GettingStarted: React.FC = () => {
    const { navigateTo } = useAppNavigation();
    const [expandedSection, setExpandedSection] = useState<string | null>('wallet');

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    return (
        <PageLayout
            maxWidth="full"
            showBackgroundEffects={false}
        >
            <PageHeader
                title="Getting Started"
                subtitle="Your complete guide to joining the experiment"
                icon="rocket"
                variant="compact"
            />
            <div className="w-full max-w-4xl mx-auto">

                {/* STEP 1: GET A SOLANA WALLET */}
                <EntranceAnimation delay={100} type="slide-up">
                    <RoyalCard variant="glass" className="p-8 mb-8 border-l-4 border-accent-primary cursor-pointer hover:border-accent-primary transition-all hover:shadow-lg hover:shadow-accent-primary/10 group" onClick={() => toggleSection('wallet')}>
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                                <div className="w-12 h-12 rounded-full bg-accent-primary/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-2xl font-bold text-accent-primary font-mono">1</span>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2 font-serif tracking-wide">
                                        Get a Solana Wallet
                                        <RoyalIcon variant={expandedSection === 'wallet' ? 'arrowUp' : 'arrowDown'} size={24} className="text-accent-primary transition-transform duration-300" />
                                    </h2>
                                    <p className="text-text-secondary">Choose a wallet to store your assets. We recommend Phantom, Solflare, or Backpack.</p>
                                </div>
                            </div>
                        </div>

                        {expandedSection === 'wallet' && (
                            <div className="mt-6 pt-6 border-t border-white/10 space-y-4 animate-in slide-in-from-top-2 duration-300">
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="bg-background-secondary/50 p-6 rounded-lg border border-border-primary hover:border-accent-primary/50 transition-colors flex flex-col h-full hover:bg-white/5">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-[#AB9FF2]/10 flex items-center justify-center p-1.5 overflow-hidden">
                                                <WalletIcon variant="phantom" size={28} />
                                            </div>
                                            <h4 className="font-bold text-white text-lg">Phantom</h4>
                                        </div>
                                        <p className="text-text-secondary text-sm mb-6 flex-grow">Most popular. Great UX.</p>
                                        <a href="https://phantom.app/download" target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:underline text-sm flex items-center gap-2 mt-auto">
                                            <RoyalIcon variant="externalLink" size={14} /> Download
                                        </a>
                                    </div>
                                    <div className="bg-background-secondary/50 p-6 rounded-lg border border-border-primary hover:border-accent-primary/50 transition-colors flex flex-col h-full hover:bg-white/5">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-[#FC7225]/10 flex items-center justify-center p-1.5 overflow-hidden">
                                                <WalletIcon variant="solflare" size={28} />
                                            </div>
                                            <h4 className="font-bold text-white text-lg">Solflare</h4>
                                        </div>
                                        <p className="text-text-secondary text-sm mb-6 flex-grow">Power user features.</p>
                                        <a href="https://solflare.com/download" target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:underline text-sm flex items-center gap-2 mt-auto">
                                            <RoyalIcon variant="externalLink" size={14} /> Download
                                        </a>
                                    </div>
                                    <div className="bg-background-secondary/50 p-6 rounded-lg border border-border-primary hover:border-accent-primary/50 transition-colors flex flex-col h-full hover:bg-white/5">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-[#E33E3F]/10 flex items-center justify-center p-1.5 overflow-hidden">
                                                <WalletIcon variant="backpack" size={28} />
                                            </div>
                                            <h4 className="font-bold text-white text-lg">Backpack</h4>
                                        </div>
                                        <p className="text-text-secondary text-sm mb-6 flex-grow">Integrated exchange.</p>
                                        <a href="https://backpack.app/downloads" target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:underline text-sm flex items-center gap-2 mt-auto">
                                            <RoyalIcon variant="externalLink" size={14} /> Download
                                        </a>
                                    </div>
                                </div>

                                <div className="bg-accent-secondary/10 p-4 rounded-lg border border-accent-secondary/30 backdrop-blur-sm">
                                    <h4 className="font-bold text-accent-secondary mb-2 flex items-center gap-2"><RoyalIcon variant="sparkles" size={16} /> Setup Instructions</h4>
                                    <ol className="list-decimal pl-5 space-y-2 text-text-secondary text-sm">
                                        <li>Install your chosen wallet extension or app.</li>
                                        <li>Click &quot;Create a new wallet&quot;</li>
                                        <li><strong className="text-white">CRITICAL:</strong> Write down your Secret Recovery Phrase (12 or 24 words) and store it safely. Never share it with anyone.</li>
                                        <li>Set a password for your wallet</li>
                                        <li>You&apos;re ready!</li>
                                    </ol>
                                </div>
                            </div>
                        )}
                    </RoyalCard>
                </EntranceAnimation>

                {/* STEP 2: BUY SOLANA (SOL) */}
                <RoyalCard variant="glass" entranceDelay={200} className="p-8 mb-8 border-l-4 border-accent-secondary cursor-pointer hover:border-accent-secondary/80 group" onClick={() => toggleSection('buy')}>
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                                <div className="w-12 h-12 rounded-full bg-accent-secondary/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-2xl font-bold text-accent-secondary font-mono">2</span>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2 font-serif tracking-wide">
                                        Buy Solana (SOL) with Fiat
                                        <RoyalIcon variant={expandedSection === 'buy' ? 'arrowUp' : 'arrowDown'} size={24} className="text-accent-secondary transition-transform duration-300" />
                                    </h2>
                                    <p className="text-text-secondary">Use credit/debit card, Apple Pay, or bank transfer directly in Phantom</p>
                                </div>
                            </div>
                        </div>

                        {expandedSection === 'buy' && (
                            <div className="mt-6 pt-6 border-t border-white/10 space-y-6 animate-in slide-in-from-top-2 duration-300">
                                <div className="bg-accent-secondary/10 p-4 rounded-lg border border-accent-secondary/30 backdrop-blur-sm">
                                    <h4 className="font-bold text-accent-secondary mb-3 flex items-center gap-2"><RoyalIcon variant="warning" size={16} /> Buy SOL in Phantom Wallet:</h4>
                                    <ol className="list-decimal pl-5 space-y-3 text-text-secondary text-sm">
                                        <li>
                                            <strong className="text-white">Open Phantom wallet</strong> (on mobile or browser extension)
                                        </li>
                                        <li>
                                            <strong className="text-white">Click the &quot;Buy&quot; button</strong> (usually has a $ icon)
                                        </li>
                                        <li>
                                            <strong className="text-white">Select &quot;Solana (SOL)&quot;</strong> from the list of cryptocurrencies
                                        </li>
                                        <li>
                                            <strong className="text-white">Enter the amount</strong> you want to purchase (in USD or your currency)
                                        </li>
                                        <li>
                                            <strong className="text-white">Choose a payment provider</strong> - Phantom partners with:
                                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                                <li><a href="https://support.moonpay.com/" target="_blank" rel="noopener noreferrer" className="hover:text-accent-primary underline decoration-dotted">MoonPay</a></li>
                                                <li><a href="https://help.coinbase.com/en/coinbase/trading-and-funding/buying-selling-or-converting-crypto/how-do-i-buy-digital-currency" target="_blank" rel="noopener noreferrer" className="hover:text-accent-primary underline decoration-dotted">Coinbase Pay</a></li>
                                                <li><a href="https://support.stripe.com/questions/buying-crypto" target="_blank" rel="noopener noreferrer" className="hover:text-accent-primary underline decoration-dotted">Stripe</a></li>
                                            </ul>
                                        </li>
                                        <li>
                                            <strong className="text-white">Select payment method</strong>:
                                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                                <li>Credit/Debit Card</li>
                                                <li>Apple Pay</li>
                                                <li>PayPal (some providers)</li>
                                                <li>Bank Transfer</li>
                                            </ul>
                                        </li>
                                        <li>
                                            <strong className="text-white">Complete the purchase</strong> - You&apos;ll be redirected to the provider&apos;s page to finalize payment
                                        </li>
                                        <li>
                                            <strong className="text-white">SOL appears in your wallet</strong> - Usually within minutes!
                                        </li>
                                    </ol>
                                </div>

                                <div className="bg-gold-500/10 p-4 rounded-lg border border-gold-500/30 backdrop-blur-sm">
                                    <h4 className="font-bold text-gold-500 mb-2 flex items-center gap-2"><RoyalIcon variant="info" size={16} /> Important Notes:</h4>
                                    <ul className="list-disc pl-5 space-y-2 text-text-secondary text-sm">
                                        <li><strong className="text-white">Fees:</strong> Payment providers charge 2-5% fees. This is normal.</li>
                                        <li><strong className="text-white">First-time users:</strong> Some providers may require identity verification (driver&apos;s license, etc.)</li>
                                        <li><strong className="text-white">Payment declined?</strong> Some banks block Solana/crypto purchases. Try a different payment method or provider.</li>
                                        <li><strong className="text-white">Keep extra SOL:</strong> You&apos;ll need a small amount (~0.01 SOL) for transaction fees on Solana. Don&apos;t spend it all!</li>
                                    </ul>
                                </div>

                                <div className="text-center">
                                    <a href="https://phantom.app/learn/guides/how-to-buy-crypto-on-phantom" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-accent-primary hover:underline hover:text-white transition-colors">
                                        <RoyalIcon variant="externalLink" size={16} />
                                        Official Phantom Guide: How to Buy SOL
                                    </a>
                                </div>
                            </div>
                        )}
                </RoyalCard>

                {/* STEP 3: CONNECT WALLET */}
                <EntranceAnimation delay={300} type="slide-up">
                    <RoyalCard variant="glass" className="p-8 mb-8 border-l-4 border-success cursor-pointer hover:border-success/80 transition-all group" onClick={() => toggleSection('connect')}>
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                                <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-2xl font-bold text-success font-mono">3</span>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2 font-serif tracking-wide">
                                        Connect to SpendThrone
                                        <RoyalIcon variant={expandedSection === 'connect' ? 'arrowUp' : 'arrowDown'} size={24} className="text-success transition-transform duration-300" />
                                    </h2>
                                    <p className="text-text-secondary">Link your wallet to the application</p>
                                </div>
                            </div>
                        </div>

                        {expandedSection === 'connect' && (
                            <div className="mt-6 pt-6 border-t border-white/10 space-y-4 animate-in slide-in-from-top-2 duration-300">
                                <p className="text-text-secondary">
                                    Look for the <span className="text-accent-primary font-bold">Connect Wallet</span> button in the top right corner of the screen (or in the menu on mobile).
                                </p>
                                <div className="flex justify-center py-4">
                                    <GlowPulse color="gold" intensity="medium">
                                        <Button 
                                            onClick={() => navigateTo('/')}
                                            variant="primary"
                                            size="lg"
                                            className="font-bold shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:scale-105 transition-transform"
                                        >
                                            Go to Home & Connect
                                        </Button>
                                    </GlowPulse>
                                </div>
                            </div>
                        )}
                    </RoyalCard>
                </EntranceAnimation>

                {/* STEP 4: PAY TRIBUTE */}
                <EntranceAnimation delay={400} type="slide-up">
                    <RoyalCard variant="glass" className="p-8 border-l-4 border-purple-500 cursor-pointer hover:border-purple-500/80 transition-all group" onClick={() => toggleSection('pay')}>
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-2xl font-bold text-purple-500 font-mono">4</span>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2 font-serif tracking-wide">
                                        Pay Tribute & Rank Up
                                        <RoyalIcon variant={expandedSection === 'pay' ? 'arrowUp' : 'arrowDown'} size={24} className="text-purple-500 transition-transform duration-300" />
                                    </h2>
                                    <p className="text-text-secondary">Destroy wealth, gain status, rule the leaderboard</p>
                                </div>
                            </div>
                        </div>

                        {expandedSection === 'pay' && (
                            <div className="mt-6 pt-6 border-t border-white/10 space-y-4 animate-in slide-in-from-top-2 duration-300">
                                <ul className="space-y-3 text-text-secondary">
                                    <li className="flex items-start gap-3">
                                        <RoyalIcon variant="sword" size={20} className="text-accent-primary mt-1" />
                                        <span>Click <strong>Pay Tribute</strong> or <strong>Overtake</strong> on the leaderboard.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <RoyalIcon variant="coins" size={20} className="text-accent-primary mt-1" />
                                        <span>Select any token (SOL, USDC, BONK, etc.) - we auto-swap to USDC value.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <RoyalIcon variant="crown" size={20} className="text-accent-primary mt-1" />
                                        <span>Sign the transaction. Once confirmed, you climb the ranks instantly.</span>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </RoyalCard>
                </EntranceAnimation>
            </div>
        </PageLayout>
    );
};

export default GettingStarted;
