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
    description: 'A commoner who dares to dream beyond their station. Every empire starts with one fool.',
    benefits: ['Basic participation', 'Visible on leaderboard'],
    multiplier: 1,
    minUsd: 0,
  },
  {
    id: 'iron-citizen',
    name: 'Iron Citizen',
    displayName: 'Iron Citizen',
    badge: '⚒️',
    icon: '🪵',
    description: 'A tradesman with ambitions above their forge. The realm notices your coin.',
    benefits: ['Citizen badge', 'Standard listing'],
    multiplier: 1.1,
    minUsd: 10,
  },
  {
    id: 'bronze-knight',
    name: 'Bronze Knight',
    displayName: 'Bronze Knight',
    badge: '🥉',
    icon: '🛡️',
    description: 'Sworn to the crown, blade at the ready. You have proven your worth in battle.',
    benefits: ['Knight badge', 'Bronze border'],
    multiplier: 1.2,
    minUsd: 50,
  },
  {
    id: 'silver-noble',
    name: 'Silver Noble',
    displayName: 'Silver Noble',
    badge: '🥈',
    icon: '⚔️',
    description: 'Born to privilege, or bought into it. The court whispers your name.',
    benefits: ['Noble badge', 'Silver border'],
    multiplier: 1.5,
    minUsd: 250,
  },
  {
    id: 'gold-ruler',
    name: 'Gold Ruler',
    displayName: 'Gold Ruler',
    badge: '🥇',
    icon: '🏆',
    description: 'Commands armies. Bankrupts nations. The throne is within sight.',
    benefits: ['Ruler badge', 'Gold border', 'Featured'],
    multiplier: 2,
    minUsd: 1000,
  },
  {
    id: 'platinum-monarch',
    name: 'Platinum Monarch',
    displayName: 'Platinum Monarch',
    badge: '👑',
    icon: '🏰',
    description: 'Divine right, mortal appetite. Few dare to challenge you.',
    benefits: ['Monarch badge', 'Platinum border', 'Priority listing'],
    multiplier: 2.5,
    minUsd: 5000,
  },
  {
    id: 'diamond-emperor',
    name: 'Diamond Emperor',
    displayName: 'Diamond Emperor',
    badge: '💎',
    icon: '🔥',
    description: 'History remembers. History fears. You answer to no one.',
    benefits: ['Emperor badge', 'Diamond border', 'Global fame'],
    multiplier: 3,
    minUsd: 10000,
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
