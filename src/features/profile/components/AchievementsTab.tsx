import React from 'react';
import { ShimmerCard, Badge, RoyalIcon, EntranceAnimation, BounceAnimation } from '@/components/ui';
import { formatDistanceToNow } from 'date-fns';
import { Achievement } from '@/shared/utils/types';

interface AchievementsTabProps {
  achievements: Achievement[];
  tierColors: Record<string, string>;
}

export const AchievementsTab: React.FC<AchievementsTabProps> = ({ achievements, tierColors }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {achievements.map((achievement: Achievement, index: number) => (
        <EntranceAnimation key={achievement.id} type="scale" delay={index * 100}>
          <ShimmerCard 
            shimmerOnHover={true}
            className={`p-6 text-center ${achievement.rarity === 'legendary' ? 'border-2 border-accent-primary' : ''}`}
          >
            <BounceAnimation intensity="subtle" trigger="hover">
            <RoyalIcon 
              variant={achievement.icon} 
              size={48} 
              className={`mx-auto mb-3 ${tierColors[achievement.rarity as keyof typeof tierColors].replace('bg-', 'text-')} filter drop-shadow-[0_0_10px_${
                achievement.rarity === 'common' ? 'rgba(107,114,128,0.5)' :
                achievement.rarity === 'rare' ? 'rgba(59,130,246,0.5)' :
                achievement.rarity === 'epic' ? 'rgba(168,85,247,0.5)' :
                'rgba(234,179,8,0.5)'
              }]`} 
            />
          </BounceAnimation>
          <h4 className="text-lg font-bold text-white mb-2">{achievement.name}</h4>
          <p className="text-sm text-text-secondary mb-3">{achievement.description}</p>
          <div className="text-xs text-text-muted">
            Unlocked {formatDistanceToNow(new Date(achievement.unlockedAt), { addSuffix: true })}
          </div>
          <Badge className={`mt-3 ${tierColors[achievement.rarity as keyof typeof tierColors]} text-white text-xs`}>
            {achievement.rarity.toUpperCase()}
          </Badge>
        </ShimmerCard>
      </EntranceAnimation>
    ))}
  </div>
  );
};
