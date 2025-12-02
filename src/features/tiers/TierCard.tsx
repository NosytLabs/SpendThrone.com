import React from 'react';
import { TierInfo } from '@/shared/utils/tierSystem';
import styles from '@/pages/Tiers.module.css';
import { EntranceAnimation, GlowCard, ShimmerEffect, FloatingAnimation, RoyalIcon } from '@/components/ui';

interface TierCardProps {
    tier: TierInfo;
}

const TierCard: React.FC<TierCardProps> = ({ tier }) => {
    const isRoyalTier = tier.id === 'diamond-emperor' || tier.id === 'pump-king';
    const isNobleTier = tier.id === 'chad-noble';
    
    return (
        <EntranceAnimation delay={0} duration={600} type="fade-in" trigger="in-view">
            {isRoyalTier ? (
                <GlowCard glowOnHover={true} borderAnimation="glow" className={styles.tierCard}>
                    <RoyalTierContent tier={tier} isRoyalTier={isRoyalTier} isNobleTier={isNobleTier} />
                </GlowCard>
            ) : (
                <div className={styles.tierCard}>
                    <RoyalTierContent tier={tier} isRoyalTier={isRoyalTier} isNobleTier={isNobleTier} />
                </div>
            )}
        </EntranceAnimation>
    );
};

const RoyalTierContent: React.FC<{ tier: TierInfo; isRoyalTier: boolean; isNobleTier: boolean }> = ({ tier, isRoyalTier, isNobleTier }) => {
    const renderIcon = () => {
        switch (tier.id) {
            case 'diamond-emperor':
                return <RoyalIcon variant="diamond" size={48} className="filter drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]" />;
            case 'pump-king':
                return <RoyalIcon variant="crown" size={48} className="filter drop-shadow-[0_0_10px_rgba(234,179,8,0.6)]" />;
            case 'chad-noble':
                return <RoyalIcon variant="shield" size={48} className="filter drop-shadow-[0_0_8px_rgba(192,192,192,0.4)]" />;
            default:
                return <span className={styles.tierIcon}>{tier.icon}</span>;
        }
    };

    return (
        <>
            <div className={styles.tierHeader}>
                {(isRoyalTier || isNobleTier) ? (
                    <FloatingAnimation direction="up" distance={3} duration={3000}>
                        <div className={styles.tierIconWrapper}>
                            {renderIcon()}
                        </div>
                    </FloatingAnimation>
                ) : (
                    <div className={styles.tierIconWrapper}>
                        {renderIcon()}
                    </div>
                )}
                <h2 className={styles.tierName}>{tier.displayName}</h2>
            </div>
            <p className={styles.tierDescription}>{tier.description}</p>
            <div className={styles.tierRequirement}>
                Spend &ge; ${tier.minUsd.toLocaleString()} total
            </div>
            <ul className={styles.tierBenefits}>
                {tier.benefits.map((benefit, index) => (
                    <li key={index}>
                        {isRoyalTier ? (
                            <ShimmerEffect speed="slow">
                                {benefit}
                            </ShimmerEffect>
                        ) : (
                            benefit
                        )}
                    </li>
                ))}
            </ul>
        </>
    );
};

export default TierCard;
