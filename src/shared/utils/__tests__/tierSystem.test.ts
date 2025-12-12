import { describe, it, expect } from 'vitest';
import { getTierFromAmount, TIERS } from '../tierSystem';

describe('Tier System Logic', () => {
    
    describe('getTierFromAmount', () => {
        it('should return Degen Peasant for $0', () => {
            const tier = getTierFromAmount(0);
            expect(tier.id).toBe('degen-peasant');
            expect(tier.name).toBe('Degen Peasant');
        });

        it('should return Bronze Knight for $51', () => {
            const tier = getTierFromAmount(51);
            expect(tier.id).toBe('bronze-knight');
        });

        it('should return Silver Noble for $250', () => {
            const tier = getTierFromAmount(250);
            expect(tier.id).toBe('silver-noble');
        });

        it('should return Diamond Emperor for $1,000,001', () => {
            const tier = getTierFromAmount(1000001);
            expect(tier.id).toBe('diamond-emperor');
        });

        it('should handle negative numbers gracefully (default to peasant)', () => {
             const tier = getTierFromAmount(-100);
             expect(tier.id).toBe('degen-peasant');
        });
    });

    describe('Tier Configurations', () => {
        it('should have 7 tiers', () => {
            expect(TIERS.length).toBe(7);
        });

        it('should be sorted by minUsd ascending', () => {
            for (let i = 0; i < TIERS.length - 1; i++) {
                expect(TIERS[i].minUsd).toBeLessThan(TIERS[i+1].minUsd);
            }
        });
    });
});
