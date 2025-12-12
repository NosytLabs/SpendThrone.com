import React from 'react';
import { Button, RoyalIcon, Skeleton } from '@/components/ui';
import { LeaderboardEntry } from '@/shared/utils/types';
import strings from '@/locales/strings.json';

interface CurrentStatusCardProps {
    leaderboard: LeaderboardEntry[];
    isDegraded: boolean;
    onUsurp: () => void;
    isLoading?: boolean;
}

export const CurrentStatusCard: React.FC<CurrentStatusCardProps> = ({ leaderboard, isDegraded, onUsurp, isLoading = false }) => {
    // Loading State
    if (isLoading) {
        return (
            <div className="bg-gradient-to-br from-background-secondary to-background-tertiary rounded-2xl border border-accent-primary/30 p-8 md:p-12 text-center shadow-2xl relative overflow-hidden">
                <div className="relative z-10 flex flex-col items-center">
                    <Skeleton className="h-10 w-3/4 max-w-md mb-6 bg-accent-primary/10" />
                    <div className="mb-8 p-6 w-full max-w-2xl mx-auto">
                        <div className="flex flex-col items-center">
                             <Skeleton variant="circular" width={64} height={64} className="mb-4 bg-accent-primary/20" />
                             <Skeleton className="h-4 w-32 mb-2 bg-text-secondary/20" />
                             <Skeleton className="h-8 w-48 mb-2 bg-accent-primary/20" />
                             <Skeleton className="h-6 w-40 bg-text-primary/20" />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Skeleton className="h-14 w-40 rounded-full bg-accent-primary/20" />
                        <Skeleton className="h-14 w-40 rounded-full bg-accent-primary/10" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-background-secondary to-background-tertiary rounded-2xl border border-accent-primary/30 p-8 md:p-12 text-center shadow-2xl relative overflow-hidden">
             {/* Noise texture removed to prevent 404, replaced with subtle gradient overlay */}
             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none"></div>
             
             <div className="relative z-10">
                {/* GLOBAL WASTE COUNTER */}
                <div className="mb-6 inline-block">
                    <div className="bg-red-900/30 border border-red-500/30 px-4 py-2 rounded-lg flex items-center gap-2">
                        <RoyalIcon variant="fire" size={16} className="text-red-500" />
                        <span className="text-red-200 text-sm font-mono tracking-wide">
                            TOTAL WEALTH INCINERATED: <span className="text-white font-bold">${leaderboard.reduce((acc, curr) => acc + curr.totalUsdValue, 0).toLocaleString()}</span>
                        </span>
                    </div>
                </div>

                <h2 className="text-3xl md:text-4xl font-cinzel font-bold text-white mb-6">
                    {leaderboard.length > 0 ? strings.home.throne_occupied : strings.home.throne_empty}
                </h2>
                
                {leaderboard.length > 0 ? (
                    <div className="mb-8 p-6 bg-black/60 rounded-xl border border-accent-secondary/50 max-w-2xl mx-auto">
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-accent-primary/20 rounded-full flex items-center justify-center mb-4 border-2 border-accent-primary">
                                <RoyalIcon variant="crown" size={32} className="text-accent-primary" />
                            </div>
                            <p className="text-text-secondary text-sm uppercase tracking-widest mb-2">{strings.home.current_emperor}</p>
                            <div className="text-2xl md:text-3xl font-bold text-accent-primary truncate font-mono mb-2">
                                {leaderboard[0].walletAddress.slice(0, 4)}...{leaderboard[0].walletAddress.slice(-4)}
                            </div>
                            <p className="text-white font-cinzel text-xl mb-4">
                                <span className="text-accent-primary mr-2">{strings.home.reigning_contribution}</span>
                                ${leaderboard[0].totalUsdValue.toLocaleString()}
                            </p>

                            {/* Emperor's Social Links - The Marketing Value */}
                            <div className="flex gap-3">
                                <a 
                                    href={`https://twitter.com/${leaderboard[0].socials?.twitter || 'elonmusk'}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="p-2 bg-white/5 rounded-full hover:bg-white/10 hover:text-[#1DA1F2] transition-colors"
                                    title="Emperor's Twitter"
                                >
                                    <RoyalIcon variant="twitter" size={20} />
                                </a>
                                <a 
                                    href={leaderboard[0].socials?.website || 'https://spendthrone.com'} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="p-2 bg-white/5 rounded-full hover:bg-white/10 hover:text-accent-primary transition-colors"
                                    title="Emperor's Project"
                                >
                                    <RoyalIcon variant="externalLink" size={20} />
                                </a>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mb-8 p-6 bg-black/60 rounded-xl border border-dashed border-text-muted/30 max-w-2xl mx-auto">
                        <p className="text-text-secondary italic">{strings.home.be_first_claim}</p>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                     <Button
                        onClick={onUsurp}
                        className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-black bg-accent-primary rounded-full hover:bg-accent-secondary transition-all hover:scale-105 shadow-[0_0_20px_rgba(234,179,8,0.4)]"
                        disabled={isDegraded}
                     >
                        <RoyalIcon variant="crown" className="mr-2" />
                        {strings.common.btn_usurp}
                     </Button>
                     <Button
                        as="link"
                        to="/about"
                        className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-accent-primary border-2 border-accent-primary rounded-full hover:bg-accent-primary/10 transition-all"
                     >
                        How It Works
                     </Button>
                </div>
             </div>
        </div>
    );
};
