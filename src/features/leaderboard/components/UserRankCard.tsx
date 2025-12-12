import React from 'react';
import { Button, RoyalIcon, Card as RoyalCard } from '@/components/ui';
import { LeaderboardEntry } from '@/shared/utils/types';
import strings from '@/locales/strings.json';

interface UserRankCardProps {
    userRank: number;
    leaderboard: LeaderboardEntry[];
    isDegraded: boolean;
    onOvertake: (amount: number) => void;
}

export const UserRankCard: React.FC<UserRankCardProps> = ({
    userRank,
    leaderboard,
    isDegraded,
    onOvertake
}) => {
    return (
        <RoyalCard variant="glass" className="p-6 mb-6 border-accent-primary/30">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent-primary/10 flex items-center justify-center border border-accent-primary/20">
                        <RoyalIcon variant="user" size={24} className="text-accent-primary" />
                    </div>
                    <div>
                        <h3 className="text-lg font-cinzel font-semibold text-white">{strings.leaderboard.your_rank}</h3>
                        <p className="text-2xl font-bold text-accent-primary drop-shadow-md">#{userRank}</p>
                    </div>
                </div>
                {!isDegraded && (
                    <Button
                        onClick={() => onOvertake(leaderboard[userRank - 2]?.totalUsdValue + 1 || 1)}
                        variant="primary"
                        size="sm"
                        className="flex items-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-accent-primary/20"
                    >
                        <RoyalIcon variant="trend" size={16} />
                        Climb Higher
                    </Button>
                )}
            </div>
        </RoyalCard>
    );
};
