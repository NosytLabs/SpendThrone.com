
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