import React, { useState } from 'react';
import { useAppNavigation } from '@/shared/utils/navigation';
import { PageLayout } from '../components/layout/PageLayout';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, RoyalCard, RoyalIcon, Button, EntranceAnimation } from '../components/ui';
import { APP_CONFIG } from '@/core/constants/appConfig';

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

                {/* STEP 1: GET A PHANTOM WALLET */}
                <EntranceAnimation delay={100} type="slide-up">
                    <Card variant="glass" className="p-8 mb-8 border-l-4 border-accent-primary cursor-pointer hover:border-accent-primary transition-all hover:shadow-lg hover:shadow-accent-primary/10" onClick={() => toggleSection('wallet')}>
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                                <div className="w-12 h-12 rounded-full bg-accent-primary/20 flex items-center justify-center flex-shrink-0">
                                    <span className="text-2xl font-bold text-accent-primary">1</span>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                                        Get a Solana Wallet
                                        <RoyalIcon variant={expandedSection === 'wallet' ? 'arrowUp' : 'arrowDown'} size={24} className="text-accent-primary" />
                                    </h2>
                                    <p className="text-text-secondary">Download Phantom - the most popular Solana wallet</p>
                                </div>
                            </div>
                        </div>

                        {expandedSection === 'wallet' && (
                            <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-background-secondary/50 p-4 rounded-lg">
                                        <h4 className="font-bold text-white mb-2">🌐 Browser Extension</h4>
                                        <p className="text-text-secondary text-sm mb-3">Works on Chrome, Firefox, Brave, and Edge.</p>
                                        <a href="https://phantom.app/download" target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:underline text-sm flex items-center gap-2">
                                            <RoyalIcon variant="externalLink" size={14} /> Download for Browser
                                        </a>
                                    </div>
                                    <div className="bg-background-secondary/50 p-4 rounded-lg">
                                        <h4 className="font-bold text-white mb-2">📱 Mobile App</h4>
                                        <p className="text-text-secondary text-sm mb-3">Available on iOS and Android.</p>
                                        <a href="https://phantom.app/download" target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:underline text-sm flex items-center gap-2">
                                            <RoyalIcon variant="externalLink" size={14} /> Get Phantom App
                                        </a>
                                    </div>
                                </div>

                                <div className="bg-accent-secondary/10 p-4 rounded-lg border border-accent-secondary/30">
                                    <h4 className="font-bold text-accent-secondary mb-2">💡 Setup Instructions</h4>
                                    <ol className="list-decimal pl-5 space-y-2 text-text-secondary text-sm">
                                        <li>Install Phantom wallet from the official site: <a href="https://phantom.app" target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:underline">phantom.app</a></li>
                                        <li>Click &quot;Create a new wallet&quot;</li>
                                        <li><strong className="text-white">CRITICAL:</strong> Write down your Secret Recovery Phrase (12 or 24 words) and store it safely. Never share it with anyone.</li>
                                        <li>Set a password for your wallet</li>
                                        <li>You&apos;re ready!</li>
                                    </ol>
                                </div>
                            </div>
                        )}
                    </Card>
                </EntranceAnimation>

                {/* STEP 2: BUY SOLANA (SOL) */}
                <RoyalCard entranceDelay={200} className="p-8 mb-8 border-l-4 border-accent-secondary cursor-pointer hover:border-accent-secondary/80" onClick={() => toggleSection('buy')}>
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                                <div className="w-12 h-12 rounded-full bg-accent-secondary/20 flex items-center justify-center flex-shrink-0">
                                    <span className="text-2xl font-bold text-accent-secondary">2</span>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                                        Buy Solana (SOL) with Fiat
                                        <RoyalIcon variant={expandedSection === 'buy' ? 'arrowUp' : 'arrowDown'} size={24} className="text-accent-secondary" />
                                    </h2>
                                    <p className="text-text-secondary">Use credit/debit card, Apple Pay, or bank transfer directly in Phantom</p>
                                </div>
                            </div>
                        </div>

                        {expandedSection === 'buy' && (
                            <div className="mt-6 pt-6 border-t border-white/10 space-y-6">
                                <div className="bg-accent-secondary/10 p-4 rounded-lg border border-accent-secondary/30">
                                    <h4 className="font-bold text-accent-secondary mb-3">📱 Buy SOL in Phantom Wallet:</h4>
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

                                <div className="bg-gold-500/10 p-4 rounded-lg border border-gold-500/30">
                                    <h4 className="font-bold text-gold-500 mb-2">⚠️ Important Notes:</h4>
                                    <ul className="list-disc pl-5 space-y-2 text-text-secondary text-sm">
                                        <li><strong className="text-white">Fees:</strong> Payment providers charge 2-5% fees. This is normal.</li>
                                        <li><strong className="text-white">First-time users:</strong> Some providers may require identity verification (driver&apos;s license, etc.)</li>
                                        <li><strong className="text-white">Payment declined?</strong> Some banks block crypto purchases. Try a different payment method or provider.</li>
                                        <li><strong className="text-white">Keep extra SOL:</strong> You&apos;ll need a small amount (~0.01 SOL) for transaction fees on Solana. Don&apos;t spend it all!</li>
                                    </ul>
                                </div>

                                <div className="text-center">
                                    <a href="https://phantom.app/learn/guides/how-to-buy-crypto-on-phantom" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-accent-primary hover:underline">
                                        <RoyalIcon variant="externalLink" size={16} />
                                        Official Phantom Guide: How to Buy Crypto
                                    </a>
                                </div>
                            </div>
                        )}
                </RoyalCard>

                {/* STEP 3: CONNECT & TRIBUTE */}
                <RoyalCard entranceDelay={300} className="p-8 mb-8 border-l-4 border-success cursor-pointer hover:border-success/80" onClick={() => toggleSection('tribute')}>
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                                <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                                    <span className="text-2xl font-bold text-success">3</span>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                                        Pay Your Tribute
                                        <RoyalIcon variant={expandedSection === 'tribute' ? 'arrowUp' : 'arrowDown'} size={24} className="text-success" />
                                    </h2>
                                    <p className="text-text-secondary">Connect your wallet to {APP_CONFIG.APP_NAME_DISPLAY} and make your contribution</p>
                                </div>
                            </div>
                        </div>

                        {expandedSection === 'tribute' && (
                            <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
                                <ol className="list-decimal pl-5 space-y-3 text-text-secondary">
                                    <li>
                                        <strong className="text-white">Go to the Home page</strong>
                                        <Button onClick={() => navigateTo('/')} variant="ghost" size="sm" className="ml-2 text-accent-primary hover:underline">
                                            → Visit Home
                                        </Button>
                                    </li>
                                    <li>
                                        <strong className="text-white">Click &quot;Connect Wallet&quot;</strong> in the top right corner
                                    </li>
                                    <li>
                                        <strong className="text-white">Select &quot;Phantom&quot;</strong> from the list
                                    </li>
                                    <li>
                                        <strong className="text-white">Approve the connection</strong> in your Phantom wallet popup
                                    </li>
                                    <li>
                                        <strong className="text-white">Click &quot;PAY TRIBUTE&quot;</strong> button
                                    </li>
                                    <li>
                                        <strong className="text-white">Choose your tribute:</strong>
                                        <ul className="list-disc pl-5 mt-2 space-y-1">
                                            <li>Pay with <strong>SOL</strong> directly</li>
                                            <li>Pay with <strong>USDC</strong> or <strong>any SPL Token</strong> (BONK, WIF, JUP, etc.)</li>
                                            <li>All tokens are automatically swapped to USDC via Jupiter Ultra API</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <strong className="text-white">Confirm the transaction</strong> in your wallet
                                    </li>
                                    <li>
                                        <strong className="text-white">Watch your rank update!</strong> Your contribution is now immortalized on the Solana blockchain.
                                    </li>
                                </ol>

                                <div className="bg-success/10 p-4 rounded-lg border border-success/30 mt-4">
                                    <h4 className="font-bold text-success mb-2">✅ You&apos;re Done!</h4>
                                    <p className="text-text-secondary text-sm">
                                        Your tribute is permanent and cannot be withdrawn. Your rank depends on your total contribution value.
                                        The more you contribute, the higher you climb.
                                    </p>
                                </div>
                            </div>
                        )}
                </RoyalCard>

                {/* FAQ */}
                <RoyalCard entranceDelay={400} className="p-8">
                        <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-bold text-white mb-2">Can I withdraw my tribute?</h4>
                                <p className="text-text-secondary text-sm">No. All tributes are permanent and locked forever. This is a core part of the experiment.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-2">What do I get for my contribution?</h4>
                                <p className="text-text-secondary text-sm">A rank on the public leaderboard, immortalized on the Solana blockchain. That&apos;s it. No tokens, no rewards, no utility.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-2">How much should I contribute?</h4>
                                <p className="text-text-secondary text-sm">As much as you&apos;re willing to burn for eternal glory. Your rank is determined by total USD value contributed.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-2">Is this safe?</h4>
                                <p className="text-text-secondary text-sm">
                                    All transactions happen on the Solana blockchain. Always verify the smart contract address and transaction details before confirming.
                                </p>
                            </div>
                        </div>
                </RoyalCard>

                {/* CTA */}
                <EntranceAnimation delay={500} type="scale">
                    <div className="mt-12 mb-12 text-center">
                        <Button
                            variant="primary"
                            size="lg"
                            className="py-4 px-10 text-xl hover:scale-110 transition-transform shadow-2xl rounded-full"
                            onClick={() => navigateTo('/')}
                        >
                            Ready to Begin →
                        </Button>
                    </div>
                </EntranceAnimation>

            </div>
        </PageLayout>
    );
};

export default GettingStarted;
