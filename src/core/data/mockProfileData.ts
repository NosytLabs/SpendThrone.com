import { RoyalIconProps } from '@/components/ui/RoyalIcon';

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: RoyalIconProps['variant'];
  unlockedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Transaction {
  id: number;
  amount: number;
  currency: string;
  timestamp: string;
  type: string;
  rankChange: number;
}

export interface RankHistoryPoint {
  date: string;
  rank: number;
}

export interface UserStats {
  averageContribution: number;
  largestContribution: number;
  totalDaysActive: number;
  longestStreak: number;
  currentStreak: number;
  rankHistory: RankHistoryPoint[];
}

export interface UserData {
  walletAddress: string;
  displayName: string;
  avatar: string;
  rank: number | null;
  totalContributed: number;
  totalTransactions: number;
  joinedDate: string;
  lastActive: string;
  tier: string;
  achievements: Achievement[];
  recentTransactions: Transaction[];
  stats: UserStats;
}

// Mock data - replace with actual API calls
export const mockUserData: UserData = {
  walletAddress: "7xKXtg2CW87d97TXJSDpbD5fGcJ4jHvXwmpqJGy8n4g7",
  displayName: "CryptoEmperor",
  avatar: "👑",
  rank: 3,
  totalContributed: 15420.50,
  totalTransactions: 47,
  joinedDate: "2024-01-15",
  lastActive: "2024-11-25",
  tier: "legendary",
  achievements: [
    { id: 1, name: "First Tribute", description: "Made your first contribution", icon: "rocket", unlockedAt: "2024-01-15", rarity: "common" },
    { id: 2, name: "High Roller", description: "Contributed over $10,000", icon: "diamond", unlockedAt: "2024-03-20", rarity: "legendary" },
    { id: 3, name: "Consistency King", description: "Made contributions 30 days in a row", icon: "fire", unlockedAt: "2024-02-14", rarity: "epic" },
    { id: 4, name: "Top 10", description: "Reached top 10 on leaderboard", icon: "trophy", unlockedAt: "2024-05-10", rarity: "rare" }
  ],
  recentTransactions: [
    { id: 1, amount: 500, currency: "USDC", timestamp: "2024-11-25T10:30:00Z", type: "tribute", rankChange: 0 },
    { id: 2, amount: 1000, currency: "SOL", timestamp: "2024-11-24T15:45:00Z", type: "tribute", rankChange: +2 },
    { id: 3, amount: 250, currency: "USDC", timestamp: "2024-11-23T09:15:00Z", type: "tribute", rankChange: -1 },
    { id: 4, amount: 2000, currency: "USDC", timestamp: "2024-11-22T18:20:00Z", type: "tribute", rankChange: +5 }
  ],
  stats: {
    averageContribution: 328.30,
    largestContribution: 5000,
    totalDaysActive: 284,
    longestStreak: 45,
    currentStreak: 12,
    rankHistory: [
      { date: "2024-01", rank: 156 },
      { date: "2024-02", rank: 89 },
      { date: "2024-03", rank: 42 },
      { date: "2024-04", rank: 18 },
      { date: "2024-05", rank: 7 },
      { date: "2024-06", rank: 5 },
      { date: "2024-07", rank: 4 },
      { date: "2024-08", rank: 3 },
      { date: "2024-09", rank: 3 },
      { date: "2024-10", rank: 3 },
      { date: "2024-11", rank: 3 }
    ]
  }
};
