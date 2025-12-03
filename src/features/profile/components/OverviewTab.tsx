import React from 'react';
import { RoyalCard, Badge, RoyalIcon, ProgressBar, LottieAnimation, GlowPulse, ShimmerEffect } from '@/components/ui';
import { formatDistanceToNow } from 'date-fns';
import { UserData } from '@/shared/utils/types';
import { CopyToClipboard } from '@/components/ui';

interface OverviewTabProps {
  /** Full user data object */
  userData: UserData;
  /** Mapping of tier names to CSS color classes */
  tierColors: Record<string, string>;
  /** Percentage progress towards next rank (0-100) */
  rankProgress: number;
}

/**
 * Overview tab content for the Profile page.
 * Displays basic profile information and rank progress statistics.
 */
export const OverviewTab: React.FC<OverviewTabProps> = ({ userData, tierColors, rankProgress }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Profile Info */}
      <RoyalCard className="p-6">
        <h3 className="royal-text-title text-white mb-4 flex items-center gap-2">
          <RoyalIcon variant="user" className="text-accent-primary" />
          Profile Information
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">Wallet Address</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-mono text-sm">
                {userData.walletAddress.slice(0, 4)}...{userData.walletAddress.slice(-4)}
              </span>
              <CopyToClipboard text={userData.walletAddress} />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">Member Since</span>
            <span className="text-white">{new Date(userData.joinedDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">Last Active</span>
            <span className="text-white">
              {formatDistanceToNow(new Date(userData.lastActive), { addSuffix: true })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">Tier</span>
            <GlowPulse>
              <Badge className={`${tierColors[userData.tier as keyof typeof tierColors]} text-white shadow-[0_0_10px_rgba(234,179,8,0.3)]`}>
                {userData.tier.toUpperCase()}
              </Badge>
            </GlowPulse>
          </div>
        </div>
      </RoyalCard>

      {/* Rank Progress */}
      <RoyalCard className="p-6">
        <h3 className="royal-text-title text-white mb-4 flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center">
            <LottieAnimation 
              url="https://assets-v2.lottiefiles.com/a/951d99e6-1153-11ee-b225-eb06e4b03b3b/YlEVGN47Y6.json"
              width={32}
              height={32}
            />
          </div>
          Rank Progress
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-text-secondary">Next Rank Milestone</span>
              <span className="text-white">{rankProgress.toFixed(0)}%</span>
            </div>
            <ShimmerEffect>
              <ProgressBar 
                value={rankProgress}
                className="h-3 shadow-inner"
                color="gold"
              />
            </ShimmerEffect>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-background-secondary/50 p-3 rounded-lg">
              <div className="text-lg font-bold text-white">{userData.stats.longestStreak}</div>
              <div className="text-xs text-text-secondary">Best Streak</div>
            </div>
            <div className="bg-background-secondary/50 p-3 rounded-lg">
              <div className="text-lg font-bold text-white">{userData.stats.totalDaysActive}</div>
              <div className="text-xs text-text-secondary">Days Active</div>
            </div>
          </div>
        </div>
      </RoyalCard>
    </div>
  );
};
