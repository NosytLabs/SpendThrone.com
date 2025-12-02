import { formatCurrency } from './formatting/currency';

export interface TierInfo {
  id: string;
  name: string;
  displayName: string;
  badge: string;
  icon: string;
  description: string;
  benefits: string[];
  multiplier: number;
  minUsd: number;
}

// Canonical tier definitions (ordered by ascending threshold)
export const TIERS: TierInfo[] = [
  {
    id: 'degen-peasant',
    name: 'Degen Peasant',
    displayName: 'Degen Peasant',
    badge: '🤡',
    icon: '🪙',
    description: 'Entry tier. Start your path to the throne.',
    benefits: ['Basic participation', 'Visible on leaderboard'],
    multiplier: 1,
    minUsd: 0,
  },
  {
    id: 'ape-knight',
    name: 'Ape Knight',
    displayName: 'Ape Knight',
    badge: '⚔️',
    icon: '🦍',
    description: 'You swing harder — recognized spender status.',
    benefits: ['Priority listing in previews', 'Knight badge'],
    multiplier: 1.2,
    minUsd: 50,
  },
  {
    id: 'chad-noble',
    name: 'Chad Noble',
    displayName: 'Chad Noble',
    badge: '🛡️',
    icon: '💼',
    description: 'Consistent spender with noble privileges.',
    benefits: ['Noble badge', 'Enhanced profile highlight'],
    multiplier: 1.5,
    minUsd: 100,
  },
  {
    id: 'pump-king',
    name: 'Pump King',
    displayName: 'Pump King',
    badge: '👑',
    icon: '🚀',
    description: 'Elite spender — near the top of the throne.',
    benefits: ['King badge', 'Featured in leader sections'],
    multiplier: 2,
    minUsd: 500,
  },
  {
    id: 'diamond-emperor',
    name: 'Diamond Hands Emperor',
    displayName: 'Diamond Hands Emperor',
    badge: '💎',
    icon: '🔥',
    description: 'Maximum prestige. You reign supreme.',
    benefits: ['Emperor badge', 'Top-tier highlight'],
    multiplier: 3,
    minUsd: 1000,
  },
];

// Return the highest tier whose threshold is <= amount
export function getTierFromAmount(amount: number): TierInfo {
  let current = TIERS[0];
  for (const tier of TIERS) {
    if (amount >= tier.minUsd) current = tier;
    else break;
  }
  return current;
}

export const getTier = (amount: number): string => {
  const tierInfo = getTierFromAmount(amount);
  return tierInfo.displayName;
};

export const getTierByUsd = (usdAmount: number): string => {
  const tierInfo = getTierFromAmount(usdAmount);
  return tierInfo.id;
};

// Format "Spend ≥ $X total" based on the tier threshold
export function formatTierRequirement(tier: TierInfo): string {
  return `Spend ≥ ${formatCurrency(tier.minUsd)} total`;
}

// Re-export currency formatting to maintain a single import surface
export { formatCurrency };
