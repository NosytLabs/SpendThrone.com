import { RoyalIconProps } from '@/components/ui/RoyalIcon';

/**
 * Represents an entry in the global leaderboard.
 */
export interface LeaderboardEntry {
  rank: number;
  walletAddress: string;
  displayName?: string;
  totalUsdValue: number;
  tier: string;
  transactionCount: number;
  timeAgo: string;
  message?: string;
  link?: string;
  socials?: {
    twitter?: string;
    website?: string;
    telegram?: string;
  };
  customLinks?: { label: string; url: string }[];
  customSections?: { title: string; content: string }[];
}

export interface Stats {
  totalParticipants: number;
  totalBurned: number;
  recentDeposits: number;
  avgDeposit: number;
}

// Preview leaderboard entry used on the Dashboard snapshot.
// Extends the base LeaderboardEntry with fields only relevant to preview UI.
export interface PreviewLeaderboardEntry extends LeaderboardEntry {
  isRecent?: boolean;
  avatar?: string;
}

export interface UserStats {
    totalDeposits: number;
    totalUsdValue: number;
    rank: number | null;
    tier: string;
}

export interface DepositHistoryItem {
    id?: string | number;
    amount: number;
    usdValue?: number;
    timestamp: number;
    originalToken?: string;
    walletAddress: string;
    txHash?: string;
    status?: string;
}

export interface PremiumFeaturesData {
    realTimeQuotes: boolean;
    advancedAnalytics: boolean;
    prioritySupport: boolean;
}


export interface HomeStats {
    totalBurned: number;
    participants: number;
    currentLeader: string;
    recentDeposits: number;
    avgDeposit: number;
}

// Common token and price types used across services
export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  balance?: number;
  usdPrice?: number;
  priceChange24h?: number;
}

export interface TokenPrice {
  mint: string; // token mint address
  symbol?: string;
  price: number;
  timestamp?: number;
}

export interface UserTotals {
  totalDeposits: number;
  totalUsdValue: number;
}

export type BackendLeaderboardItem = {
  id?: string | number;
  rank?: number;
  name?: string;
  amount?: number;
  transactionCount?: number;
  timestamp?: number;
};

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: RoyalIconProps['variant'];
  unlockedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Transaction {
  id: number | string;
  amount: number;
  currency: string;
  timestamp: string;
  type: string;
  rankChange: number;
  signature?: string;
}

export interface RankHistoryPoint {
  date: string;
  rank: number;
}

export interface UserProfileStats {
  averageContribution: number;
  largestContribution: number;
  totalDaysActive: number;
  longestStreak: number;
  currentStreak: number;
  rankHistory: RankHistoryPoint[];
}

/**
 * Aggregated user data for the Profile page.
 */
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
  stats: UserProfileStats;
  message?: string;
  link?: string;
  customLinks?: { label: string; url: string }[];
  customSections?: { title: string; content: string }[];
}
